terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

# CloudFront용 WAF WebACL
# ⚠️  scope = "CLOUDFRONT" 는 반드시 us-east-1 리전에서 생성해야 함
# → main.tf에서 provider = aws.us_east_1 로 호출할 것

resource "aws_wafv2_web_acl" "cloudfront" {
  name        = "${var.project_name}-waf-${var.environment}"
  description = "WAF for ${var.project_name} CloudFront"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # ── AWS 관리형 규칙 1: Core Rule Set ───────────────────────────────────────
  # SQL Injection, XSS 등 OWASP Top 10 기반 일반 웹 공격 방어
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-crs-metric"
      sampled_requests_enabled   = true
    }
  }

  # ── AWS 관리형 규칙 2: Known Bad Inputs ────────────────────────────────────
  # Log4Shell, SSRF 등 알려진 악성 페이로드 차단
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-bad-inputs-metric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-waf-${var.environment}"
    sampled_requests_enabled   = true
  }

  tags = {
    Name = "${var.project_name}-waf-${var.environment}"
  }
}
