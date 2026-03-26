terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # 로컬 state (기본값)
  # S3 backend로 전환하려면 아래 주석을 해제하고 `terraform init -migrate-state` 실행:
  #
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "portfolio/terraform.tfstate"
  #   region         = "ap-northeast-2"
  #   encrypt        = true
  #   dynamodb_table = "terraform-lock"  # 선택: state locking용
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ─── Modules ────────────────────────────────────────────────────────────────

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
  environment  = var.environment
}

module "s3" {
  source       = "./modules/s3"
  project_name = var.project_name
  environment  = var.environment
  bucket_name  = var.bucket_name
}

module "cloudfront" {
  source                        = "./modules/cloudfront"
  project_name                  = var.project_name
  environment                   = var.environment
  s3_bucket_id                  = module.s3.bucket_id
  s3_bucket_arn                 = module.s3.bucket_arn
  s3_bucket_regional_domain_name = module.s3.bucket_regional_domain_name
}

module "lambda" {
  source           = "./modules/lambda"
  project_name     = var.project_name
  environment      = var.environment
  lambda_role_arn  = module.iam.lambda_role_arn
  s3_bucket_name   = module.s3.bucket_id
  lambda_image_uri = var.lambda_image_uri
}

module "api_gateway" {
  source            = "./modules/api-gateway"
  project_name      = var.project_name
  environment       = var.environment
  lambda_arn        = module.lambda.lambda_arn
  lambda_invoke_arn = module.lambda.lambda_invoke_arn
}
