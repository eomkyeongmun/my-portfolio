variable "project_name" {
  description = "프로젝트 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경"
  type        = string
}

variable "domain_name" {
  description = "루트 도메인 (예: eomkyeongmun.me)"
  type        = string
}

variable "cloudfront_domain_name" {
  description = "CloudFront 배포 도메인 (Alias 레코드 대상)"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM 인증서 ARN (us-east-1)"
  type        = string
}

variable "acm_domain_validation_options" {
  description = "ACM DNS 검증 옵션 (module.acm.domain_validation_options)"
  type = set(object({
    domain_name           = string
    resource_record_name  = string
    resource_record_type  = string
    resource_record_value = string
  }))
}
