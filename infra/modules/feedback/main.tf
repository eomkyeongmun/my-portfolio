# ── Lambda 소스 패키징 ─────────────────────────────────────────────────────────

data "archive_file" "feedback_handler" {
  type        = "zip"
  source_file = "${path.module}/../../../lambda/feedback/handler.mjs"
  output_path = "${path.module}/../../../lambda/feedback/handler.zip"
}

data "archive_file" "email_sender" {
  type        = "zip"
  source_file = "${path.module}/../../../lambda/email/handler.mjs"
  output_path = "${path.module}/../../../lambda/email/handler.zip"
}

# ── IAM Roles ─────────────────────────────────────────────────────────────────

resource "aws_iam_role" "feedback_lambda" {
  name = "${var.project_name}-feedback-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "feedback_lambda_basic" {
  role       = aws_iam_role.feedback_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "feedback_lambda_eventbridge" {
  name = "eventbridge-put-events"
  role = aws_iam_role.feedback_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "events:PutEvents"
      Resource = aws_cloudwatch_event_bus.portfolio.arn
    }]
  })
}

resource "aws_iam_role" "email_lambda" {
  name = "${var.project_name}-email-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "email_lambda_basic" {
  role       = aws_iam_role.email_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "email_lambda_ses" {
  name = "ses-send-email"
  role = aws_iam_role.email_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "ses:SendEmail"
      Resource = "*"
    }]
  })
}

# ── EventBridge Custom Bus ────────────────────────────────────────────────────

resource "aws_cloudwatch_event_bus" "portfolio" {
  name = "portfolio-events"
}

# ── Lambda 함수 ───────────────────────────────────────────────────────────────

resource "aws_cloudwatch_log_group" "feedback_handler" {
  name              = "/aws/lambda/${var.project_name}-feedback-handler-${var.environment}"
  retention_in_days = 14
}

resource "aws_lambda_function" "feedback_handler" {
  function_name = "${var.project_name}-feedback-handler-${var.environment}"
  role          = aws_iam_role.feedback_lambda.arn
  runtime       = "nodejs22.x"
  handler       = "handler.handler"

  filename         = data.archive_file.feedback_handler.output_path
  source_code_hash = data.archive_file.feedback_handler.output_base64sha256

  environment {
    variables = {
      EVENT_BUS_NAME = aws_cloudwatch_event_bus.portfolio.name
      ALLOWED_ORIGIN = var.allowed_origin
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.feedback_lambda_basic,
    aws_cloudwatch_log_group.feedback_handler,
  ]

  tags = {
    Name = "${var.project_name}-feedback-handler-${var.environment}"
  }
}

resource "aws_cloudwatch_log_group" "email_sender" {
  name              = "/aws/lambda/${var.project_name}-email-sender-${var.environment}"
  retention_in_days = 14
}

resource "aws_lambda_function" "email_sender" {
  function_name = "${var.project_name}-email-sender-${var.environment}"
  role          = aws_iam_role.email_lambda.arn
  runtime       = "nodejs22.x"
  handler       = "handler.handler"

  filename         = data.archive_file.email_sender.output_path
  source_code_hash = data.archive_file.email_sender.output_base64sha256

  environment {
    variables = {
      FEEDBACK_EMAIL = var.feedback_email
      SENDER_EMAIL   = var.sender_email
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.email_lambda_basic,
    aws_cloudwatch_log_group.email_sender,
  ]

  tags = {
    Name = "${var.project_name}-email-sender-${var.environment}"
  }
}

# ── EventBridge Rule & Target ─────────────────────────────────────────────────

resource "aws_cloudwatch_event_rule" "feedback_received" {
  name           = "${var.project_name}-feedback-received-${var.environment}"
  event_bus_name = aws_cloudwatch_event_bus.portfolio.name
  description    = "포트폴리오 피드백 이벤트 → email-sender 트리거"

  event_pattern = jsonencode({
    source = ["portfolio.feedback"]
  })
}

resource "aws_cloudwatch_event_target" "email_sender" {
  rule           = aws_cloudwatch_event_rule.feedback_received.name
  event_bus_name = aws_cloudwatch_event_bus.portfolio.name
  target_id      = "email-sender"
  arn            = aws_lambda_function.email_sender.arn
}

# EventBridge → email-sender Lambda 호출 권한
resource "aws_lambda_permission" "eventbridge_email_sender" {
  statement_id  = "AllowEventBridgeInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_sender.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.feedback_received.arn
}

# ── SES Domain Identity ───────────────────────────────────────────────────────

resource "aws_ses_domain_identity" "sender" {
  domain = "eomkyeongmun.me"
}

# SES DKIM 설정 (Route53에 CNAME 레코드 추가 필요)
resource "aws_ses_domain_dkim" "sender" {
  domain = aws_ses_domain_identity.sender.domain
}
