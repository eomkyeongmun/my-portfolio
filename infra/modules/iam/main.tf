data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ─── Lambda 실행 Role ────────────────────────────────────────────────────────

resource "aws_iam_role" "lambda_execution" {
  name = "${var.project_name}-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = {
    Name = "${var.project_name}-lambda-role-${var.environment}"
  }
}

# Lambda 기본 실행 정책 (CloudWatch Logs 쓰기)
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ECR 이미지 pull 정책
resource "aws_iam_role_policy_attachment" "lambda_ecr" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# X-Ray 추적 데이터 쓰기 권한
resource "aws_iam_role_policy_attachment" "lambda_xray" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

# S3 접근 정책 — PDF 저장 버킷에만 쓰기 허용
resource "aws_iam_role_policy" "lambda_s3" {
  name = "${var.project_name}-lambda-s3-${var.environment}"
  role = aws_iam_role.lambda_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3PdfWrite"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "arn:aws:s3:::*/${var.project_name}/*"
      },
      {
        Sid    = "S3ListBucket"
        Effect = "Allow"
        Action = "s3:ListBucket"
        Resource = "arn:aws:s3:::*"
        Condition = {
          StringLike = {
            "s3:prefix" = ["${var.project_name}/*"]
          }
        }
      }
    ]
  })
}

# ─── GitHub Actions 배포 User ────────────────────────────────────────────────

resource "aws_iam_user" "github_actions" {
  name = "${var.project_name}-github-actions-${var.environment}"
  path = "/ci/"

  tags = {
    Name    = "${var.project_name}-github-actions-${var.environment}"
    Purpose = "GitHub Actions CI/CD deployment"
  }
}

resource "aws_iam_user_policy" "github_actions" {
  name = "${var.project_name}-github-actions-policy-${var.environment}"
  user = aws_iam_user.github_actions.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # S3 배포 — next export 결과물 업로드
      {
        Sid    = "S3Deploy"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          "arn:aws:s3:::${var.project_name}*",
          "arn:aws:s3:::${var.project_name}*/*"
        ]
      },
      # CloudFront 캐시 무효화
      {
        Sid    = "CloudFrontInvalidate"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/*"
      },
      # ECR 이미지 푸시
      {
        Sid    = "ECRPush"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Sid    = "ECRPushImage"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/${var.project_name}*"
      },
      # Lambda 이미지 업데이트
      {
        Sid    = "LambdaDeploy"
        Effect = "Allow"
        Action = [
          "lambda:UpdateFunctionCode",
          "lambda:GetFunction",
          "lambda:GetFunctionConfiguration"
        ]
        Resource = "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:${var.project_name}*"
      }
    ]
  })
}

# GitHub Actions용 Access Key
# 주의: Secret Access Key는 Terraform state에 저장됨
# state 파일을 안전하게 관리하거나, 생성 후 즉시 GitHub Secrets에 등록하고 state에서 제거하세요.
resource "aws_iam_access_key" "github_actions" {
  user = aws_iam_user.github_actions.name
}
