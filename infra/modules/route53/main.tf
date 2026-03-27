# Hosted Zone — Route 53에서 도메인 DNS를 관리
resource "aws_route53_zone" "website" {
  name = var.domain_name

  tags = {
    Name = "${var.project_name}-zone-${var.environment}"
  }
}

# ACM DNS 검증 CNAME 레코드
resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in var.acm_domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = aws_route53_zone.website.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  records = [each.value.record]
}

# ACM 인증서 검증 완료 대기
resource "aws_acm_certificate_validation" "website" {
  provider                = aws.us_east_1
  certificate_arn         = var.acm_certificate_arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}

# 루트 도메인 A 레코드 (Alias → CloudFront)
resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.website.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2" # CloudFront 고정 Hosted Zone ID
    evaluate_target_health = false
  }
}

# www 서브도메인 A 레코드 (Alias → CloudFront)
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.website.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}
