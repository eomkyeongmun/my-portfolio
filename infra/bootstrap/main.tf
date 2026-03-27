# ─────────────────────────────────────────────────────────────────────────────
# Terraform Remote State Bootstrap
#
# 목적: 메인 인프라 state를 S3에 저장하고 DynamoDB로 동시 실행을 잠금
#
# 실행 순서:
#   1. cd infra/bootstrap
#   2. terraform init
#   3. terraform apply
#   4. 출력된 bucket 이름을 infra/main.tf의 backend "s3" 블록에 입력
#   5. cd infra && terraform init -migrate-state
#
# ⚠️  이 디렉토리 자체의 state는 로컬에서 관리 (부트스트랩이므로)
# ─────────────────────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

variable "project_name" {
  description = "프로젝트 이름 (버킷·테이블 네이밍에 사용)"
  type        = string
  default     = "my-portfolio"
}

# ─── S3 버킷 — Terraform state 파일 저장 ────────────────────────────────────
resource "aws_s3_bucket" "tfstate" {
  bucket = "${var.project_name}-tfstate"

  # 실수로 삭제 방지
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name    = "${var.project_name}-tfstate"
    Purpose = "Terraform remote state"
  }
}

# 버전 관리 활성화 — state 파일 이전 버전 복구 가능
resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  versioning_configuration {
    status = "Enabled"
  }
}

# 서버 측 암호화 (AES-256)
resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 퍼블릭 액세스 완전 차단
resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket                  = aws_s3_bucket.tfstate.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ─── DynamoDB 테이블 — State 락 (동시 실행 방지) ────────────────────────────
resource "aws_dynamodb_table" "tfstate_lock" {
  name         = "${var.project_name}-tfstate-lock"
  billing_mode = "PAY_PER_REQUEST" # 사용량 기반 과금 (소규모 프로젝트에 적합)
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name    = "${var.project_name}-tfstate-lock"
    Purpose = "Terraform state locking"
  }
}

# ─── Outputs ─────────────────────────────────────────────────────────────────
output "tfstate_bucket_name" {
  description = "infra/main.tf backend 블록의 bucket 값으로 사용"
  value       = aws_s3_bucket.tfstate.id
}

output "tfstate_lock_table_name" {
  description = "infra/main.tf backend 블록의 dynamodb_table 값으로 사용"
  value       = aws_dynamodb_table.tfstate_lock.name
}

output "next_steps" {
  description = "다음 단계 안내"
  value       = <<-EOT
    ✅ Bootstrap 완료!

    다음 단계:
    1. infra/main.tf의 backend "s3" 블록 주석 해제
    2. bucket         = "${aws_s3_bucket.tfstate.id}"
       dynamodb_table = "${aws_dynamodb_table.tfstate_lock.name}"
       으로 설정
    3. cd infra && terraform init -migrate-state
  EOT
}
