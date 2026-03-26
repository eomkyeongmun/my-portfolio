output "api_endpoint" {
  description = "API Gateway 엔드포인트 URL"
  value       = aws_apigatewayv2_api.pdf_api.api_endpoint
}

output "api_id" {
  description = "API Gateway API ID"
  value       = aws_apigatewayv2_api.pdf_api.id
}

output "pdf_api_url" {
  description = "PDF 생성 API URL 예시 (slug 부분 교체해서 사용)"
  value       = "${aws_apigatewayv2_api.pdf_api.api_endpoint}/api/pdf/{slug}"
}
