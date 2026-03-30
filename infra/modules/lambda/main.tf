# ECR 리포지토리 — Puppeteer Lambda 컨테이너 이미지 저장소
resource "aws_ecr_repository" "pdf_generator" {
  name                 = "${var.project_name}-pdf-generator"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-pdf-generator-${var.environment}"
  }
}

# ECR 수명 주기 정책 — 이미지 10개 초과 시 오래된 것부터 삭제
resource "aws_ecr_lifecycle_policy" "pdf_generator" {
  repository = aws_ecr_repository.pdf_generator.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "최근 태그 이미지 10개만 유지"
        selection = {
          tagStatus   = "tagged"
          tagPrefixList = ["v"]
          countType   = "imageCountMoreThan"
          countNumber = 10
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "untagged 이미지 7일 후 삭제"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      }
    ]
  })
}

# Lambda 함수 — Puppeteer PDF 생성기 (컨테이너 이미지 기반)
#
# 최초 배포 순서:
#   1. terraform apply -target=module.lambda.aws_ecr_repository.pdf_generator
#   2. ECR 로그인 후 Docker 이미지 빌드 & 푸시
#      aws ecr get-login-password --region ap-northeast-2 | \
#        docker login --username AWS --password-stdin <ECR_URL>
#      docker build -t <ECR_URL>:latest ./lambda/pdf-generator
#      docker push <ECR_URL>:latest
#   3. variables.tf의 lambda_image_uri 업데이트 후 terraform apply
#
# 이후 배포: GitHub Actions가 이미지 푸시 + aws lambda update-function-code로 처리
resource "aws_lambda_function" "pdf_generator" {
  function_name = "${var.project_name}-pdf-generator-${var.environment}"
  role          = var.lambda_role_arn
  package_type  = "Image"
  image_uri     = var.lambda_image_uri

  timeout     = 60    # Puppeteer PDF 생성에 충분한 시간
  memory_size = 2048  # Puppeteer는 최소 1024MB, 여유 있게 2GB 권장

  environment {
    variables = {
      S3_BUCKET                = var.s3_bucket_name
      ENVIRONMENT              = var.environment
      PROJECT_NAME             = var.project_name
      SITE_URL                 = "https://${var.site_url}"  # CloudFront 도메인 — print 페이지 렌더링 대상
      AWS_XRAY_CONTEXT_MISSING = "LOG_ERROR"
    }
  }

  # X-Ray 분산 추적 활성화
  tracing_config {
    mode = "Active"
  }

  # image_uri는 GitHub Actions CI/CD가 관리 — Terraform이 덮어쓰지 않도록
  lifecycle {
    ignore_changes = [image_uri]
  }

  tags = {
    Name = "${var.project_name}-pdf-generator-${var.environment}"
  }

  depends_on = [aws_ecr_repository.pdf_generator]
}

# CloudWatch 로그 그룹 — 14일 보관
resource "aws_cloudwatch_log_group" "pdf_generator" {
  name              = "/aws/lambda/${aws_lambda_function.pdf_generator.function_name}"
  retention_in_days = 14

  tags = {
    Name = "${var.project_name}-pdf-generator-logs-${var.environment}"
  }
}
