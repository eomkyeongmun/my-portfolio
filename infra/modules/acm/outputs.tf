output "certificate_arn" {
  description = "ACM 인증서 ARN"
  value       = aws_acm_certificate.website.arn
}

output "domain_validation_options" {
  description = "DNS 검증용 레코드 정보 (Route 53에서 CNAME으로 등록)"
  value       = aws_acm_certificate.website.domain_validation_options
}
