output "site_url" {
  description = "포트폴리오 사이트 URL"
  value       = "https://${var.domain_name}"
}

output "acm_validation_records" {
  description = "가비아 DNS에 등록할 ACM 검증 CNAME 레코드"
  value = {
    for dvo in module.acm.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }
}

output "waf_web_acl_arn" {
  description = "WAF WebACL ARN"
  value       = module.waf.web_acl_arn
}

output "cloudfront_domain_name" {
  description = "CloudFront 배포 도메인 (사이트 접속 URL)"
  value       = module.cloudfront.distribution_domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront 배포 ID (캐시 무효화 시 사용)"
  value       = module.cloudfront.distribution_id
}

output "s3_bucket_name" {
  description = "정적 파일 업로드 대상 S3 버킷 이름"
  value       = module.s3.bucket_id
}

output "api_gateway_endpoint" {
  description = "API Gateway 엔드포인트 (PDF 생성 API)"
  value       = module.api_gateway.api_endpoint
}

output "ecr_repository_url" {
  description = "ECR 리포지토리 URL (Docker 이미지 푸시 대상)"
  value       = module.lambda.ecr_repository_url
}

output "lambda_function_name" {
  description = "Lambda 함수 이름 (GitHub Actions에서 이미지 업데이트 시 사용)"
  value       = module.lambda.lambda_function_name
}

output "github_actions_access_key_id" {
  description = "GitHub Actions 배포용 IAM Access Key ID"
  value       = module.iam.github_actions_access_key_id
  sensitive   = true
}

output "github_actions_secret_access_key" {
  description = "GitHub Actions 배포용 IAM Secret Access Key"
  value       = module.iam.github_actions_secret_access_key
  sensitive   = true
}
