# infra/terraform.tfvars 로 복사해서 사용 (terraform.tfvars는 .gitignore에 포함)

aws_region   = "ap-northeast-2"
project_name = "my-portfolio"
environment  = "prod"
bucket_name  = "my-portfolio-prod-20240101"  # 전 세계 고유한 이름

# ECR 리포지토리 생성 후 실제 URI로 교체
# lambda_image_uri = "123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/my-portfolio-pdf-generator:latest"
