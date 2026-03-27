variable "project_name" {
  description = "프로젝트 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경"
  type        = string
}

variable "lambda_role_arn" {
  description = "Lambda 실행 IAM Role ARN"
  type        = string
}

variable "s3_bucket_name" {
  description = "PDF 파일을 저장할 S3 버킷 이름"
  type        = string
}

variable "lambda_image_uri" {
  description = "Lambda 컨테이너 이미지 URI (ECR)"
  type        = string
  default     = "PLACEHOLDER"
}

variable "site_url" {
  description = "CloudFront 도메인 (https:// 제외, 예: d1234abcd.cloudfront.net) — Lambda SITE_URL 환경 변수에 사용"
  type        = string
}
