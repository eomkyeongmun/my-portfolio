variable "project_name" {
  description = "프로젝트 이름"
  type        = string
}

variable "environment" {
  description = "배포 환경"
  type        = string
}

variable "domain_name" {
  description = "루트 도메인 (예: eomkyeongmun.me)"
  type        = string
}
