output "distribution_id" {
  description = "CloudFront 배포 ID"
  value       = aws_cloudfront_distribution.website.id
}

output "distribution_arn" {
  description = "CloudFront 배포 ARN"
  value       = aws_cloudfront_distribution.website.arn
}

output "distribution_domain_name" {
  description = "CloudFront 배포 도메인 (접속 URL)"
  value       = aws_cloudfront_distribution.website.domain_name
}
