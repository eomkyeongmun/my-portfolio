variable "project_name" {
  description = "프로젝트 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경"
  type        = string
}

variable "s3_bucket_id" {
  description = "정적 파일 S3 버킷 ID"
  type        = string
}

variable "s3_bucket_arn" {
  description = "정적 파일 S3 버킷 ARN"
  type        = string
}

variable "s3_bucket_regional_domain_name" {
  description = "S3 버킷 리전 도메인 (origin domain으로 사용)"
  type        = string
}

# 커스텀 도메인 연결 시 활성화
# variable "acm_certificate_arn" {
#   description = "ACM 인증서 ARN (반드시 us-east-1 리전)"
#   type        = string
#   default     = null
# }
