# ─── SNS 알람 토픽 ───────────────────────────────────────────────────────────

resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-alerts-${var.environment}"

  tags = {
    Name = "${var.project_name}-alerts-${var.environment}"
  }
}

# 이메일 구독 — alarm_email 변수가 설정된 경우에만 생성
resource "aws_sns_topic_subscription" "email" {
  count = var.alarm_email != null ? 1 : 0

  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

# ─── CloudWatch Alarms ────────────────────────────────────────────────────────

# Lambda: 오류 발생 시 알람 (PDF 생성 실패)
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-lambda-errors-${var.environment}"
  alarm_description   = "Lambda PDF 생성 중 오류 발생"
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  dimensions          = { FunctionName = var.lambda_function_name }
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-lambda-errors-${var.environment}"
  }
}

# Lambda: 평균 실행 시간이 타임아웃(60s)의 75%인 45s 초과 시 알람
resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "${var.project_name}-lambda-duration-${var.environment}"
  alarm_description   = "Lambda 평균 실행 시간이 45초 초과 — 타임아웃 임박"
  namespace           = "AWS/Lambda"
  metric_name         = "Duration"
  dimensions          = { FunctionName = var.lambda_function_name }
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 1
  threshold           = 45000
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-lambda-duration-${var.environment}"
  }
}

# Lambda: Throttle 발생 시 알람 (동시성 한도 도달)
resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  alarm_name          = "${var.project_name}-lambda-throttles-${var.environment}"
  alarm_description   = "Lambda Throttle 발생 — 동시성 한도 도달"
  namespace           = "AWS/Lambda"
  metric_name         = "Throttles"
  dimensions          = { FunctionName = var.lambda_function_name }
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-lambda-throttles-${var.environment}"
  }
}

# API Gateway: 5xx 서버 오류 발생 시 알람
resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "${var.project_name}-api-5xx-${var.environment}"
  alarm_description   = "API Gateway 5xx 오류 발생"
  namespace           = "AWS/ApiGateway"
  metric_name         = "5XXError"
  dimensions          = { ApiId = var.api_id }
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-api-5xx-${var.environment}"
  }
}

# ─── CloudWatch Dashboard ─────────────────────────────────────────────────────

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      # ── 알람 상태 패널 ──────────────────────────────────────────────────────
      {
        type   = "alarm"
        x      = 0
        y      = 0
        width  = 24
        height = 3
        properties = {
          title  = "알람 상태"
          alarms = [
            aws_cloudwatch_metric_alarm.lambda_errors.arn,
            aws_cloudwatch_metric_alarm.lambda_duration.arn,
            aws_cloudwatch_metric_alarm.lambda_throttles.arn,
            aws_cloudwatch_metric_alarm.api_5xx.arn,
          ]
        }
      },
      # ── Lambda 호출·오류·스로틀 ────────────────────────────────────────────
      {
        type   = "metric"
        x      = 0
        y      = 3
        width  = 12
        height = 6
        properties = {
          title   = "Lambda — 호출 / 오류 / Throttle"
          region  = var.aws_region
          view    = "timeSeries"
          stacked = false
          period  = 300
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", var.lambda_function_name,
              { stat = "Sum", label = "호출 수" }],
            ["AWS/Lambda", "Errors", "FunctionName", var.lambda_function_name,
              { stat = "Sum", label = "오류", color = "#d62728" }],
            ["AWS/Lambda", "Throttles", "FunctionName", var.lambda_function_name,
              { stat = "Sum", label = "Throttle", color = "#ff7f0e" }],
          ]
        }
      },
      # ── Lambda 실행 시간 ───────────────────────────────────────────────────
      {
        type   = "metric"
        x      = 12
        y      = 3
        width  = 12
        height = 6
        properties = {
          title  = "Lambda — Duration (ms)"
          region = var.aws_region
          view   = "timeSeries"
          period = 300
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", var.lambda_function_name,
              { stat = "Average", label = "평균" }],
            ["AWS/Lambda", "Duration", "FunctionName", var.lambda_function_name,
              { stat = "Maximum", label = "최대", color = "#d62728" }],
          ]
          annotations = {
            horizontal = [
              { value = 45000, label = "경고 임계값 (45s)", color = "#ff7f0e" },
              { value = 60000, label = "타임아웃 (60s)", color = "#d62728" }
            ]
          }
        }
      },
      # ── API Gateway 요청 현황 ─────────────────────────────────────────────
      {
        type   = "metric"
        x      = 0
        y      = 9
        width  = 12
        height = 6
        properties = {
          title  = "API Gateway — 요청 / 4xx / 5xx"
          region = var.aws_region
          view   = "timeSeries"
          period = 300
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiId", var.api_id,
              { stat = "Sum", label = "전체 요청" }],
            ["AWS/ApiGateway", "4XXError", "ApiId", var.api_id,
              { stat = "Sum", label = "4xx", color = "#ff7f0e" }],
            ["AWS/ApiGateway", "5XXError", "ApiId", var.api_id,
              { stat = "Sum", label = "5xx", color = "#d62728" }],
          ]
        }
      },
      # ── API Gateway 응답 시간 ─────────────────────────────────────────────
      {
        type   = "metric"
        x      = 12
        y      = 9
        width  = 12
        height = 6
        properties = {
          title  = "API Gateway — Latency (ms)"
          region = var.aws_region
          view   = "timeSeries"
          period = 300
          metrics = [
            ["AWS/ApiGateway", "Latency", "ApiId", var.api_id,
              { stat = "Average", label = "전체 지연" }],
            ["AWS/ApiGateway", "IntegrationLatency", "ApiId", var.api_id,
              { stat = "Average", label = "Lambda 지연", color = "#2ca02c" }],
          ]
        }
      },
    ]
  })
}
