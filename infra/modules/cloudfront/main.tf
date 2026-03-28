# Origin Access Control — OAI(구) 대신 OAC(신) 방식 사용
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.project_name}-oac-${var.environment}"
  description                       = "OAC for ${var.project_name} S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# S3 버킷 정책 — CloudFront OAC만 GetObject 허용
resource "aws_s3_bucket_policy" "website" {
  bucket = var.s3_bucket_id
  policy = data.aws_iam_policy_document.s3_cloudfront.json
}

data "aws_iam_policy_document" "s3_cloudfront" {
  statement {
    sid    = "AllowCloudFrontOAC"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${var.s3_bucket_arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.website.arn]
    }
  }
}

# CloudFront Function — 디렉터리 경로를 index.html로 rewrite
# /path/ → /path/index.html (trailingSlash: true 로 빌드된 Next.js 정적 사이트용)
resource "aws_cloudfront_function" "rewrite_index" {
  name    = "${var.project_name}-rewrite-index-${var.environment}"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite /path/ → /path/index.html for Next.js static export"
  publish = true
  code    = <<-EOF
    async function handler(event) {
      const request = event.request;
      const uri = request.uri;
      if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
      }
      return request;
    }
  EOF
}

# 보안 헤더 응답 정책
# CloudFront가 모든 응답에 보안 관련 HTTP 헤더를 자동으로 추가한다.
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name    = "${var.project_name}-security-headers-${var.environment}"
  comment = "Security headers for ${var.project_name}"

  security_headers_config {
    # HTTPS 강제 (2년) — preload list 등록 기준 충족
    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    # MIME 타입 스니핑 차단
    content_type_options {
      override = true
    }
    # iframe 삽입 차단 (클릭재킹 방지)
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    # XSS 필터 활성화
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
    # Referrer 정책 — 동일 출처만 전체 URL 전달
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }

  # 브라우저 기능 접근 제한
  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }
  }
}

# 관리형 캐시 정책 — CachingOptimized (S3 정적 파일에 최적)
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

# 관리형 오리진 요청 정책 — CORS-S3Origin
data "aws_cloudfront_origin_request_policy" "cors_s3" {
  name = "Managed-CORS-S3Origin"
}

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.project_name} portfolio (${var.environment})"
  price_class         = "PriceClass_200" # 북미 + 유럽 + 아시아 (PriceClass_All보다 저렴)
  web_acl_id          = var.web_acl_arn  # WAF WebACL 연결

  # 커스텀 도메인이 설정된 경우 aliases 추가
  aliases = var.domain_name != null ? [var.domain_name] : []

  origin {
    domain_name              = var.s3_bucket_regional_domain_name
    origin_id                = "S3-${var.project_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  # 기본 캐시 동작
  default_cache_behavior {
    target_origin_id       = "S3-${var.project_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    cache_policy_id             = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id    = data.aws_cloudfront_origin_request_policy.cors_s3.id
    response_headers_policy_id  = aws_cloudfront_response_headers_policy.security_headers.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_index.arn
    }
  }

  # SPA 대응 — 404/403 → index.html 리다이렉트
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  # 커스텀 도메인이 있으면 ACM 인증서 사용, 없으면 기본 CloudFront 인증서 사용
  dynamic "viewer_certificate" {
    for_each = var.acm_certificate_arn != null ? [1] : []
    content {
      acm_certificate_arn      = var.acm_certificate_arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1.2_2021"
    }
  }

  dynamic "viewer_certificate" {
    for_each = var.acm_certificate_arn == null ? [1] : []
    content {
      cloudfront_default_certificate = true
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "${var.project_name}-distribution-${var.environment}"
  }
}
