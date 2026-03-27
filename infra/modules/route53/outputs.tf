output "hosted_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = aws_route53_zone.website.zone_id
}

output "name_servers" {
  description = "도메인 등록 시 설정할 네임서버 목록"
  value       = aws_route53_zone.website.name_servers
}
