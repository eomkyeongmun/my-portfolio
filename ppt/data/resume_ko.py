"""
이력서 (한국어) 데이터
- 이 파일만 수정하면 한국어 이력서 PPT가 갱신됩니다.
"""

PROFILE = {
    "name": "엄경문",
    "title": "AI 기술을 실제 인프라와 서비스로 연결하는 사람이 되겠습니다",
    "birthdate": "2002.03.21",
    "email": "eomkyeongmun@naver.com",
    "phone": "010-4716-6629",
    "github": "github.com/eomkyeongmun",
    "blog": "velog.io/@eomkyeongmun",
    "portfolio": "eomkyeongmun.me",
}

EDUCATION = {
    "school": "동국대학교",
    "major": "정보통신공학과",
    "period": "2021.03 - 2027.02 (재학)",
    "gpa": "총 4.08 / 4.5",
    "major_gpa": "전공 4.25 / 4.5",
}

# 경력 / 인턴 / 부트캠프
EXPERIENCE = [
    {
        "company": "Rock Korea",
        "role": "소프트웨어 엔지니어 인턴",
        "period": "2026.03 - 2026.06",
        "description": "LLM·RAG 기반 자동화 툴 개발, 자동차공학회 논문 작성",
    },
    {
        "company": "CJ OliveNetworks",
        "role": "Cloud Wave 7기",
        "period": "2025.12 - 2026.02",
        "description": "클라우드 인프라·DevOps 부트캠프 수료",
    },
]

# 자격증
CERTIFICATIONS = [
    {"name": "AWS Certified Solutions Architect – Associate", "issuer": "AWS",       "date": "2026.03"},
    {"name": "SQL 개발자 (SQLD)",                            "issuer": "K-DATA",    "date": "2025.12"},
    {"name": "리눅스마스터 2급",                              "issuer": "KAIT",      "date": "2025.10"},
    {"name": "데이터분석 준전문가 (ADsP)",                   "issuer": "K-DATA",    "date": "2025.03"},
]

# 동아리 / 군 경력
ACTIVITIES = [
    {"name": "FC 정통 (축구소모임 주장)", "period": "2025.03 - 2026.02"},
    {"name": "TAVE (개발 동아리)",        "period": "2025.03 - 2025.07"},
    {"name": "링커스 (직무탐색동아리)",   "period": "2024.09 - 2024.12"},
    {"name": "FC TOTO (축구중앙동아리)",  "period": "2022.03 - 2025.08"},
    {"name": "육군 병장 만기 전역",       "period": "2022.05 - 2023.11"},
]

# 프로젝트: 이력서에는 제목 + 기간 + 한 줄 설명만
PROJECTS = [
    {
        "title": "EKS · Central VPC 인프라",
        "period": "2026.02 - 2026.03",
        "summary": "EKS 기반 플랫폼 + Central VPC 중앙 관제 구조 설계. QA에서 2,000 RPS · 12만 요청 처리 검증.",
    },
    {
        "title": "개인 포트폴리오 사이트 구축",
        "period": "2026.03 -",
        "summary": "Next.js + S3·CloudFront·Lambda 서버리스 구조. Terraform IaC + GitHub Actions CI/CD 단독 구축.",
    },
    {
        "title": "Newgnal Backend",
        "period": "2025.05 - 2025.07",
        "summary": "Spring Boot 기반 커뮤니티 백엔드. 게시글·댓글·좋아요·신고 API와 크롤링 스케줄러 구현.",
    },
]

# 기술 스택 (카테고리 → 항목)
SKILLS = {
    "Cloud / Infra":    ["AWS EKS", "Terraform", "CloudFront", "S3", "ALB", "Docker", "ECR"],
    "CI/CD & GitOps":   ["GitHub Actions", "ArgoCD", "Helm"],
    "Observability":    ["Prometheus", "Grafana", "CloudWatch", "X-Ray"],
    "Security":         ["IRSA", "AWS WAF", "Secrets Manager"],
    "Backend":          ["Spring Boot", "Java", "Python / FastAPI", "JPA / MySQL"],
}

# 핵심 키워드 (헤더 태그용)
KEYWORDS = ["AWS / Cloud", "Docker / DevOps", "Infra Architecture"]
