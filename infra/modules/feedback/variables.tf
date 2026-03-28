variable "project_name" {
  description = "프로젝트 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경"
  type        = string
}

variable "feedback_email" {
  description = "피드백 수신 이메일 주소"
  type        = string
  default     = "eomkyeongmun@naver.com"
}

variable "sender_email" {
  description = "SES 발신 이메일 주소 (SES 검증된 도메인이어야 함)"
  type        = string
  default     = "noreply@eomkyeongmun.me"
}

variable "allowed_origin" {
  description = "CORS allow_origin 값 (예: https://www.eomkyeongmun.me)"
  type        = string
  default     = "*"
}
