output "lambda_role_arn" {
  description = "Lambda 실행 IAM Role ARN"
  value       = aws_iam_role.lambda_execution.arn
}

output "lambda_role_name" {
  description = "Lambda 실행 IAM Role 이름"
  value       = aws_iam_role.lambda_execution.name
}

output "github_actions_user_arn" {
  description = "GitHub Actions IAM User ARN"
  value       = aws_iam_user.github_actions.arn
}

output "github_actions_access_key_id" {
  description = "GitHub Actions Access Key ID"
  value       = aws_iam_access_key.github_actions.id
  sensitive   = true
}

output "github_actions_secret_access_key" {
  description = "GitHub Actions Secret Access Key — GitHub Secrets에 등록 후 state에서 제거 권장"
  value       = aws_iam_access_key.github_actions.secret
  sensitive   = true
}
