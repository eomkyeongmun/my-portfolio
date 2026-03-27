terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # 로컬 state (기본값)
  # S3 backend로 전환하려면:
  #   1. cd infra/bootstrap && terraform init && terraform apply
  #   2. 아래 주석 해제 후 terraform init -migrate-state 실행
  #
  # backend "s3" {
  #   bucket         = "my-portfolio-tfstate"
  #   key            = "portfolio/terraform.tfstate"
  #   region         = "ap-northeast-2"
  #   encrypt        = true
  #   dynamodb_table = "my-portfolio-tfstate-lock"
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

# WAF (scope=CLOUDFRONT) 는 반드시 us-east-1 리전에서 생성해야 함
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# ─── Modules ────────────────────────────────────────────────────────────────

module "waf" {
  source       = "./modules/waf"
  project_name = var.project_name
  environment  = var.environment

  providers = {
    aws = aws.us_east_1
  }
}

module "acm" {
  source       = "./modules/acm"
  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name

  providers = {
    aws = aws.us_east_1
  }
}

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
  source                         = "./modules/cloudfront"
  project_name                   = var.project_name
  environment                    = var.environment
  s3_bucket_id                   = module.s3.bucket_id
  s3_bucket_arn                  = module.s3.bucket_arn
  s3_bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  web_acl_arn                    = module.waf.web_acl_arn
  # domain_name / acm_certificate_arn 은 인증서 검증 완료 후 활성화
  # domain_name         = var.domain_name
  # acm_certificate_arn = module.acm.certificate_arn
}

module "lambda" {
  source           = "./modules/lambda"
  project_name     = var.project_name
  environment      = var.environment
  lambda_role_arn  = module.iam.lambda_role_arn
  s3_bucket_name   = module.s3.bucket_id
  lambda_image_uri = var.lambda_image_uri
  site_url         = module.cloudfront.distribution_domain_name
}

module "api_gateway" {
  source            = "./modules/api-gateway"
  project_name      = var.project_name
  environment       = var.environment
  lambda_arn        = module.lambda.lambda_arn
  lambda_invoke_arn = module.lambda.lambda_invoke_arn
}
