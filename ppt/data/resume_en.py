"""
Resume (English) data
- Edit this file to update the English resume PPT.
"""

PROFILE = {
    "name": "Kyeongmun Eom",
    "title": "Bridging AI Technology with Real-World Infrastructure and Services",
    "birthdate": "Mar 21, 2002",
    "email": "eomkyeongmun@naver.com",
    "phone": "+82-10-4716-6629",
    "github": "github.com/eomkyeongmun",
    "blog": "velog.io/@eomkyeongmun",
    "portfolio": "eomkyeongmun.me",
}

EDUCATION = {
    "school": "Dongguk University",
    "major": "Department of Information and Communication Engineering",
    "period": "Mar 2021 - Feb 2027 (Expected)",
    "gpa": "GPA 4.08 / 4.5",
    "major_gpa": "Major GPA 4.25 / 4.5",
}

EXPERIENCE = [
    {
        "company": "Rock Korea",
        "role": "Software Engineer Intern",
        "period": "Mar 2026 - Jun 2026",
        "description": "Developing an LLM- and RAG-based automation tool; co-authoring a KSAE paper.",
    },
    {
        "company": "CJ OliveNetworks",
        "role": "Cloud Wave 7th Cohort",
        "period": "Dec 2025 - Feb 2026",
        "description": "Completed a cloud infrastructure & DevOps bootcamp.",
    },
]

CERTIFICATIONS = [
    {"name": "AWS Certified Solutions Architect - Associate", "issuer": "AWS",     "date": "Mar 2026"},
    {"name": "SQL Developer (SQLD)",                          "issuer": "K-DATA",  "date": "Dec 2025"},
    {"name": "Linux Master Level 2",                          "issuer": "KAIT",    "date": "Oct 2025"},
    {"name": "Advanced Data Analytics Semi-Pro (ADsP)",       "issuer": "K-DATA",  "date": "Mar 2025"},
]

ACTIVITIES = [
    {"name": "FC Jeongtong (Soccer Club, Captain)",     "period": "Mar 2025 - Feb 2026"},
    {"name": "TAVE (Developer Club)",                   "period": "Mar 2025 - Jul 2025"},
    {"name": "LINKERS (Career Exploration Club)",       "period": "Sep 2024 - Dec 2024"},
    {"name": "FC TOTO (University Soccer Club)",        "period": "Mar 2022 - Aug 2025"},
    {"name": "ROK Army (Sergeant, honorably discharged)", "period": "May 2022 - Nov 2023"},
]

PROJECTS = [
    {
        "title": "EKS · Central VPC Infrastructure",
        "period": "Feb 2026 - Mar 2026",
        "summary": "EKS-based platform with Central VPC observability hub. Validated 2,000 RPS / 120K requests in QA.",
    },
    {
        "title": "Personal Portfolio Website",
        "period": "Mar 2026 -",
        "summary": "Next.js + S3 / CloudFront / Lambda serverless. End-to-end Terraform IaC and GitHub Actions CI/CD.",
    },
    {
        "title": "Newgnal Backend",
        "period": "May 2025 - Jul 2025",
        "summary": "Spring Boot community backend. Posts/comments/likes/reports APIs with news crawling scheduler.",
    },
]

SKILLS = {
    "Cloud / Infra":    ["AWS EKS", "Terraform", "CloudFront", "S3", "ALB", "Docker", "ECR"],
    "CI/CD & GitOps":   ["GitHub Actions", "ArgoCD", "Helm"],
    "Observability":    ["Prometheus", "Grafana", "CloudWatch", "X-Ray"],
    "Security":         ["IRSA", "AWS WAF", "Secrets Manager"],
    "Backend":          ["Spring Boot", "Java", "Python / FastAPI", "JPA / MySQL"],
}

KEYWORDS = ["AWS / Cloud", "Docker / DevOps", "Infra Architecture"]
