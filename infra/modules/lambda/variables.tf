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
