export interface Skill {
  name: string;
  description: string;
  level: 1 | 2 | 3; // 1=familiar, 2=working, 3=core
}

export interface SkillCategory {
  category: string;
  items: Skill[];
}

export const skills: SkillCategory[] = [
  {
    category: "Backend",
    items: [
      {
        name: "Spring Boot",
        description:
          "Spring Security·OAuth2·JWT 기반 인증과 레이어드 아키텍처 REST API 설계·구현",
        level: 2,
      },
      {
        name: "Java",
        description:
          "OOP 원칙 기반 의존성 주입·인터페이스 분리로 모듈 결합도 최소화",
        level: 2,
      },
      {
        name: "Python / FastAPI",
        description: "비동기 처리 기반 경량 REST API 서버 구현",
        level: 2,
      },
      {
        name: "JPA / MySQL",
        description:
          "연관관계 매핑과 N+1 분석·Fetch Join으로 쿼리 최적화",
        level: 2,
      },
    ],
  },
  {
    category: "Infra / Platform",
    items: [
      {
        name: "AWS EKS",
        description:
          "KEDA·Karpenter 오토스케일링으로 2,000 RPS·12만 요청 무중단 처리 검증",
        level: 3,
      },
      {
        name: "Terraform",
        description:
          "전 환경 인프라를 코드로 정의해 환경별 재현성·DR 구조 확보",
        level: 2,
      },
      {
        name: "AWS (CloudFront · S3)",
        description:
          "CDN 캐싱·정적 자산 서버리스 서빙으로 오리진 부하 최소화 및 글로벌 응답속도 개선",
        level: 2,
      },
      {
        name: "AWS (ALB)",
        description:
          "리스너 룰 기반 경로·호스트 라우팅으로 서비스별 트래픽 분산 및 헬스체크 구성",
        level: 2,
      },
      {
        name: "Docker / ECR",
        description:
          "컨테이너 이미지 표준화 및 ECR 기반 이미지 버전 관리로 배포 일관성 확보",
        level: 3,
      },
    ],
  },
  {
    category: "CI/CD & GitOps",
    items: [
      {
        name: "GitHub Actions",
        description:
          "빌드·테스트·배포 전 과정 파이프라인 자동화로 수동 배포 제거",
        level: 2,
      },
      {
        name: "Argo CD",
        description:
          "Git 단일 소스 기준 선언형 배포로 운영 변경 이력 일관성 확보",
        level: 2,
      },
    ],
  },
  {
    category: "Observability",
    items: [
      {
        name: "Prometheus / Grafana",
        description:
          "메트릭 수집·시각화 대시보드 구축, KEDA 스케일링 판단 지표로 활용",
        level: 2,
      },
      {
        name: "CloudWatch",
        description:
          "로그 메트릭 필터·알람·SNS·Lambda 체인으로 DNS 보안 이벤트 자동 탐지",
        level: 2,
      },
      {
        name: "OpenTelemetry / X-Ray",
        description:
          "분산 추적으로 서비스 간 레이턴시 병목 분석 및 요청 흐름 가시화",
        level: 2,
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        name: "IRSA",
        description:
          "ServiceAccount 단위 IAM 권한 분리로 최소 권한 원칙 적용",
        level: 3,
      },
      {
        name: "AWS WAF",
        description:
          "CloudFront 앞단 L7 보안 정책으로 웹 공격 방어",
        level: 2,
      },
      {
        name: "Secrets Manager",
        description:
          "시크릿 중앙 관리로 코드·환경변수 하드코딩 제거 및 보안 범위 최소화",
        level: 2,
      },
    ],
  },
];
