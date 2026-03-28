variable "project_name" {
  description = "프로젝트 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경"
  type        = string
}

variable "lambda_arn" {
  description = "PDF 생성 Lambda 함수 ARN"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "PDF 생성 Lambda 함수 Invoke ARN"
  type        = string
}

variable "domain_name" {
  description = "커스텀 도메인 (CORS allow_origins에 사용, null이면 전체 허용)"
  type        = string
  default     = null
}
