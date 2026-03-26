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
