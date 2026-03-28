output "feedback_lambda_arn" {
  description = "feedback-handler Lambda 함수 ARN"
  value       = aws_lambda_function.feedback_handler.arn
}

output "feedback_lambda_invoke_arn" {
  description = "feedback-handler Lambda Invoke ARN"
  value       = aws_lambda_function.feedback_handler.invoke_arn
}

# terraform apply 후 외부 DNS에 아래 CNAME 레코드 3개를 수동 추가해야 SES 발송 가능
output "ses_dkim_cname_records" {
  description = "외부 DNS에 추가해야 할 SES DKIM CNAME 레코드 (이름 → 값)"
  value = {
    for token in aws_ses_domain_dkim.sender.dkim_tokens :
    "${token}._domainkey.eomkyeongmun.me" => "${token}.dkim.amazonses.com"
  }
}

output "ses_domain_verification_token" {
  description = "외부 DNS에 추가해야 할 SES 도메인 검증 TXT 레코드 값 (_amazonses.eomkyeongmun.me)"
  value       = aws_ses_domain_identity.sender.verification_token
}
