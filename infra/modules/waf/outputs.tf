output "web_acl_arn" {
  description = "WAF WebACL ARN (CloudFront web_acl_id에 사용)"
  value       = aws_wafv2_web_acl.cloudfront.arn
}
