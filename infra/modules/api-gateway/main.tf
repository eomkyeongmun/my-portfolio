# HTTP API (API Gateway v2) — REST API보다 저렴하고 Lambda 통합이 간단
resource "aws_apigatewayv2_api" "pdf_api" {
  name          = "${var.project_name}-pdf-api-${var.environment}"
  protocol_type = "HTTP"
  description   = "Portfolio PDF generation API"

  cors_configuration {
    allow_headers = ["Content-Type", "Authorization"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_origins = var.domain_name != null ? ["https://${var.domain_name}"] : ["*"]
    max_age       = 3600
  }

  tags = {
    Name = "${var.project_name}-pdf-api-${var.environment}"
  }
}

# Lambda 통합
resource "aws_apigatewayv2_integration" "pdf_lambda" {
  api_id                 = aws_apigatewayv2_api.pdf_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_invoke_arn
  payload_format_version = "2.0" # Lambda 함수에서 event.requestContext 구조 변경됨
}

# 라우트 — GET /api/pdf/{slug}
resource "aws_apigatewayv2_route" "pdf" {
  api_id    = aws_apigatewayv2_api.pdf_api.id
  route_key = "GET /api/pdf/{slug}"
  target    = "integrations/${aws_apigatewayv2_integration.pdf_lambda.id}"
}

# 자동 배포 스테이지
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.pdf_api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      sourceIp       = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      protocol       = "$context.protocol"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }

  tags = {
    Name = "${var.project_name}-api-stage-${var.environment}"
  }
}

# CloudWatch 로그 그룹 — API Gateway 액세스 로그
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}-pdf-api-${var.environment}"
  retention_in_days = 14

  tags = {
    Name = "${var.project_name}-api-logs-${var.environment}"
  }
}

# Lambda 실행 권한 — API Gateway가 PDF Lambda를 호출할 수 있도록
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.pdf_api.execution_arn}/*/*"
}

# feedback-handler 통합
resource "aws_apigatewayv2_integration" "feedback_lambda" {
  api_id                 = aws_apigatewayv2_api.pdf_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.feedback_lambda_invoke_arn
  payload_format_version = "2.0"
}

# 라우트 — POST /api/feedback
resource "aws_apigatewayv2_route" "feedback" {
  api_id    = aws_apigatewayv2_api.pdf_api.id
  route_key = "POST /api/feedback"
  target    = "integrations/${aws_apigatewayv2_integration.feedback_lambda.id}"
}

# Lambda 실행 권한 — API Gateway가 feedback Lambda를 호출할 수 있도록
resource "aws_lambda_permission" "api_gateway_feedback" {
  statement_id  = "AllowAPIGatewayInvokeFeedback"
  action        = "lambda:InvokeFunction"
  function_name = var.feedback_lambda_arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.pdf_api.execution_arn}/*/*"
}
