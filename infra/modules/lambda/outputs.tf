output "lambda_arn" {
  description = "Lambda 함수 ARN"
  value       = aws_lambda_function.pdf_generator.arn
}

output "lambda_invoke_arn" {
  description = "Lambda 함수 Invoke ARN (API Gateway 통합에 사용)"
  value       = aws_lambda_function.pdf_generator.invoke_arn
}

output "lambda_function_name" {
  description = "Lambda 함수 이름"
  value       = aws_lambda_function.pdf_generator.function_name
}

output "ecr_repository_url" {
  description = "ECR 리포지토리 URL (Docker push 대상)"
  value       = aws_ecr_repository.pdf_generator.repository_url
}
