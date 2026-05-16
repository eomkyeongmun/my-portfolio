"""
Portfolio (English) data
- Edit this file to update the English portfolio PPT when projects are added/changed.
- diagram: path relative to project root. Missing files render as a grey placeholder.
"""

OWNER = {
    "name": "Kyeongmun Eom",
    "title": "Bridging AI Technology with Real-World Infrastructure and Services",
    "subtitle": "Portfolio",
    "portfolio_url": "eomkyeongmun.me/en",
    "github": "github.com/eomkyeongmun",
}

PROJECTS = [
    {
        "title": "EKS · Central VPC Infrastructure",
        "category": "Infrastructure",
        "period": "Feb 2026 - Mar 2026",
        "role": "Team Lead · Kubernetes Architecture · EKS Build-out",
        "diagram": "public/images/aws_cj_infra.png",
        "summary": (
            "Designed and built an EKS-based application platform and a Central VPC observability hub. "
            "Validated the architecture under 2,000 RPS / 120K requests in QA."
        ),
        "highlights": [
            "Five environments (Prod / QA / Dev / DR / Central VPC) with clear boundaries",
            "Multi-layer autoscaling: KEDA + Karpenter (45 → 110 Pods, auto node growth)",
            "ArgoCD GitOps + Helm standardization + IRSA per-Pod IAM scope",
            "DNS Firewall → CloudWatch → Lambda → Slack security alert chain",
        ],
        "tech_stack": [
            "Terraform", "AWS EKS", "KEDA", "Karpenter", "ArgoCD", "Helm",
            "Prometheus", "IRSA", "Route 53", "CloudWatch",
        ],
        "problem": (
            "CPU-based HPA couldn't keep up with traffic spikes, causing unready Pods and Pending nodes. "
            "Separated probes, unified ALB health checks, and combined KEDA + 45 pre-scaled Pods + Karpenter into a layered scaling design."
        ),
        "result": "Sustained 2,000 RPS for 60s in QA, processing 120,000 requests with zero downtime.",
        "link": "velog.io/@eomkyeongmun/series/CJ-Olive-Networks-Project",
    },
    {
        "title": "Personal Portfolio Website",
        "category": "DevOps · Cloud",
        "period": "Mar 2026 -",
        "role": "Sole owner: frontend, serverless backend, IaC, CI/CD",
        "diagram": "public/images/real.png",
        "summary": (
            "Built and operate a Next.js portfolio on a fully serverless AWS stack "
            "(S3 + CloudFront + Lambda), with PDF generation and an EventBridge·SES feedback pipeline."
        ),
        "highlights": [
            "S3 OAC + WAF + Response Headers Policy security layers",
            "Container-based Lambda + Puppeteer for PDF (with bundled Korean fonts)",
            "EventBridge custom bus decouples feedback intake from email delivery",
            "X-Ray + CloudWatch + SNS for distributed tracing and alerting",
        ],
        "tech_stack": [
            "Next.js 16", "TypeScript", "Tailwind v4", "AWS S3", "CloudFront",
            "WAF", "Lambda", "API Gateway", "ECR", "EventBridge", "SES",
            "Terraform", "GitHub Actions",
        ],
        "problem": (
            "An asymmetric workload (mostly static, occasionally heavy PDF generation) had to be made cost-efficient. "
            "Global CDN handles the static side; container Lambda handles the heavy work on-demand."
        ),
        "result": "No always-on servers; code push automatically rolls out to the site and Lambda.",
        "link": "github.com/eomkyeongmun/my-portfolio",
    },
    {
        "title": "Newgnal Backend",
        "category": "Backend",
        "period": "May 2025 - Jul 2025",
        "role": "Backend developer · APIs for posts, comments, likes, reports",
        "diagram": "public/images/backend_arc.png",
        "summary": (
            "A Spring Boot community backend that collects, analyzes, and serves news data to a mobile app. "
            "Auth, APIs, crawling scheduler, and analysis integrations unified into a single architecture."
        ),
        "highlights": [
            "OAuth2 + JWT + Spring Security authentication flow",
            "Redis caching + MySQL persistence with clear responsibility split",
            "Selenium scheduler isolates crawling from user requests",
            "Docker Compose standardizes the team dev environment",
        ],
        "tech_stack": [
            "Spring Boot", "Spring Security", "OAuth2 / JWT", "JPA / MySQL",
            "Redis", "Selenium", "Docker Compose", "GitHub Actions",
        ],
        "problem": (
            "Same code, different results across teammates' machines. "
            "Reframed Docker as a 'dev-environment standardization tool' and codified the entire stack with Docker Compose."
        ),
        "result": "Eliminated environment-mismatch errors and established a baseline standard for team collaboration.",
        "link": "github.com/eomkyeongmun/Newgnal-Backend",
    },
]
