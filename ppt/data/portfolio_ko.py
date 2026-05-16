"""
포트폴리오 (한국어) 데이터
- 프로젝트가 추가/변경될 때 이 파일만 수정하면 한국어 포트폴리오 PPT가 갱신됩니다.
- diagram: 프로젝트 루트(/) 기준 상대경로. 없으면 회색 박스로 대체.
"""

OWNER = {
    "name": "엄경문",
    "title": "AI 기술을 실제 인프라와 서비스로 연결하는 사람이 되겠습니다",
    "subtitle": "포트폴리오",
    "portfolio_url": "eomkyeongmun.me",
    "github": "github.com/eomkyeongmun",
}

PROJECTS = [
    {
        "title": "EKS · Central VPC 인프라",
        "category": "Infrastructure",
        "period": "2026.02 - 2026.03",
        "role": "팀장 · 쿠버네티스 아키텍처 설계 · EKS 구축",
        "diagram": "public/images/aws_cj_infra.png",
        "summary": (
            "EKS 기반 애플리케이션 플랫폼과 Central VPC 중앙 관제 네트워크를 설계·구축. "
            "QA 환경에서 2,000 RPS · 12만 요청을 처리하며 구조의 유효성을 검증했습니다."
        ),
        "highlights": [
            "Prod / QA / Dev / DR / Central VPC 5개 환경 분리 설계",
            "KEDA + Karpenter 다층 오토스케일링 (Pod 45→110, 노드 자동 증설)",
            "ArgoCD GitOps + Helm 표준화 + IRSA Pod 단위 권한 분리",
            "DNS Firewall → CloudWatch → Lambda → Slack 보안 알림 체인",
        ],
        "tech_stack": [
            "Terraform", "AWS EKS", "KEDA", "Karpenter", "ArgoCD", "Helm",
            "Prometheus", "IRSA", "Route53", "CloudWatch",
        ],
        "problem": (
            "CPU 기반 HPA는 요청 급증을 반영하지 못해 미준비 Pod 유입과 Pending이 반복. "
            "Probe 분리·ALB 헬스체크 통일과 KEDA·선기동 45 Pod·Karpenter를 결합해 다층 확장 구조를 설계했습니다."
        ),
        "result": "QA에서 2,000 RPS를 60초 동안 유지, 총 120,000 요청을 무중단 처리.",
        "link": "velog.io/@eomkyeongmun/series/CJ-올리브네트웍스-프로젝트",
    },
    {
        "title": "개인 포트폴리오 사이트 구축",
        "category": "DevOps · Cloud",
        "period": "2026.03 -",
        "role": "프론트엔드 · 서버리스 백엔드 · IaC · CI/CD 단독 구축",
        "diagram": "public/images/real.png",
        "summary": (
            "Next.js 기반 포트폴리오를 S3 + CloudFront + Lambda 서버리스 구조로 구축. "
            "PDF 다운로드와 EventBridge·SES 기반 피드백 시스템까지 직접 운영합니다."
        ),
        "highlights": [
            "S3 OAC + WAF + Response Headers Policy로 보안 레이어 완성",
            "Puppeteer 컨테이너 Lambda로 PDF 생성 (한글 폰트 번들링)",
            "EventBridge 커스텀 버스로 피드백·이메일 발송 느슨 결합",
            "X-Ray + CloudWatch + SNS 운영 모니터링 체계",
        ],
        "tech_stack": [
            "Next.js 16", "TypeScript", "Tailwind v4", "AWS S3", "CloudFront",
            "WAF", "Lambda", "API Gateway", "ECR", "EventBridge", "SES",
            "Terraform", "GitHub Actions",
        ],
        "problem": (
            "정적 콘텐츠 + 간헐적 PDF 생성이라는 비대칭 워크로드를 비용 효율적으로 설계하는 것이 핵심. "
            "CDN으로 정적 콘텐츠를 글로벌 캐싱하고, 무거운 작업만 컨테이너 Lambda로 분리했습니다."
        ),
        "result": "상시 서버 없이 운영 비용 최소화, 단일 도메인 + 자동 배포로 코드 push → 사이트 반영 자동화.",
        "link": "github.com/eomkyeongmun/my-portfolio",
    },
    {
        "title": "Newgnal Backend",
        "category": "Backend",
        "period": "2025.05 - 2025.07",
        "role": "백엔드 개발 · 게시글/댓글/좋아요/신고 API 설계",
        "diagram": "public/images/backend_arc.png",
        "summary": (
            "뉴스 데이터를 수집·분석하고 모바일 앱에 제공하는 Spring Boot 기반 커뮤니티 백엔드. "
            "인증, API, 크롤링 스케줄러, 분석 서비스 연동을 일관된 구조로 통합했습니다."
        ),
        "highlights": [
            "OAuth2 + JWT + Spring Security 인증 구조",
            "Redis 캐싱 + MySQL 영속 저장 역할 분담",
            "Selenium 스케줄러로 크롤링을 사용자 요청과 분리",
            "Docker Compose 기반 팀 개발환경 표준화",
        ],
        "tech_stack": [
            "Spring Boot", "Spring Security", "OAuth2 / JWT", "JPA / MySQL",
            "Redis", "Selenium", "Docker Compose", "GitHub Actions",
        ],
        "problem": (
            "팀원 환경 차이로 같은 코드의 실행 결과가 달라지는 문제가 반복. "
            "Docker를 배포 도구가 아닌 '개발환경 표준화 도구'로 재정의해 Docker Compose로 전체 스택을 코드화했습니다."
        ),
        "result": "환경 차이 오류가 사라지고, 협업에서 실행 환경 통일의 기준을 세웠습니다.",
        "link": "github.com/eomkyeongmun/Newgnal-Backend",
    },
]
