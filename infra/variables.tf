variable "aws_region" {
  description = "AWS 리전"
  type        = string
  default     = "ap-northeast-2"
}

variable "project_name" {
  description = "프로젝트 이름 — 리소스 네이밍에 사용됨 (예: my-portfolio)"
  type        = string
  default     = "my-portfolio"
}

variable "environment" {
  description = "배포 환경 (prod | staging | dev)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["prod", "staging", "dev"], var.environment)
    error_message = "environment는 prod, staging, dev 중 하나여야 합니다."
  }
}

variable "bucket_name" {
  description = "S3 버킷 이름 — 전 세계 고유해야 함 (예: my-portfolio-prod-20240101)"
  type        = string
}

variable "lambda_image_uri" {
  description = <<-EOT
    Lambda 컨테이너 이미지 URI (ECR).

    최초 배포 순서:
      1. terraform apply -target=module.lambda.aws_ecr_repository.pdf_generator
      2. Docker 이미지 빌드 후 ECR 푸시
      3. 이 변수에 이미지 URI 설정 후 terraform apply

    예: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/my-portfolio-pdf-generator:latest
  EOT
  type        = string
  default     = "PLACEHOLDER"  # 최초 ECR 생성 후 실제 URI로 교체
}
