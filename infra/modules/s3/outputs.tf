output "bucket_id" {
  description = "S3 버킷 이름 (ID)"
  value       = aws_s3_bucket.website.id
}

output "bucket_arn" {
  description = "S3 버킷 ARN"
  value       = aws_s3_bucket.website.arn
}

output "bucket_regional_domain_name" {
  description = "S3 버킷 리전 도메인 (CloudFront origin에 사용)"
  value       = aws_s3_bucket.website.bucket_regional_domain_name
}
