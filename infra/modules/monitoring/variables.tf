variable "project_name" {
  description = "프로젝트 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경"
  type        = string
}

variable "aws_region" {
  description = "AWS 리전 (CloudWatch 대시보드 메트릭 리전 지정에 사용)"
  type        = string
}

variable "lambda_function_name" {
  description = "모니터링 대상 Lambda 함수 이름"
  type        = string
}

variable "api_id" {
  description = "모니터링 대상 API Gateway v2 API ID"
  type        = string
}

variable "alarm_email" {
  description = "알람 수신 이메일 주소 (null이면 구독 없이 SNS 토픽만 생성)"
  type        = string
  default     = null
}
