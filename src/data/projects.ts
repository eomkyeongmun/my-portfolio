export interface TechStack {
  name: string;
  role: string;
  reason: string; // 핵심 원칙: "어떤 대안들이 있었고, 왜 이 기술을 선택했는가?"에 대한 답
}

export interface ProblemSolving {
  issue: string; // 맞닥뜨린 문제 상황
  analysis: string; // 문제 원인 파악 및 분석 과정
  solution: string; // 해결 방법 및 근거 (왜 이 방법으로 해결했는가)
  result: string; // 그로 인한 결과(성능 개선 수치 등 검증 가능한 데이터)
}

export interface Project {
  category: "backend" | "infrastructure" | "devops";
  title: string;
  period: string; // 예: "2023.01 ~ 2023.06"
  overview: {
    description: string;
    role: string;
  };
  thumbnail?: string; // 홈 카드 썸네일 (없으면 architecture.diagram 사용)
  architecture: {
    diagram: string; // 이미지 경로
    description: string; // 시스템의 전체적인 동작 플로우 및 구성 요소 설명
    reasoning: string; // 설계 근거: "수많은 방식 중 왜 이런 아키텍처로 구성했는가?" (핵심 원칙)
  };
  techStack: TechStack[];
  problemSolving: ProblemSolving[];
  retrospective: {
    improvements: string; // 개선된 점 (얻은 가치)
    regrets: string; // 아쉬운 점 (일정/자원 등의 한계로 타협했던 부분)
    futureWork: string; // 향후 개선 방향
  };
  links: {
    github?: string;
    demo?: string;
    blog?: string;
    [key: string]: string | undefined;
  };
}

export const projects: Project[] = [
  {
    category: "backend",
    title: "Newgnal Backend",
    period: "2025.05 ~ 2025.07",
    thumbnail: "/images/tave_signal.png",
    overview: {
      description:
        "뉴스 데이터를 수집·분석하고 모바일 앱에 제공하는 Spring Boot 기반 백엔드 시스템입니다. 인증, 게시글/댓글, 좋아요, 신고, 크롤링 및 분석 서비스 연동까지 담당했습니다.",
      role: "게시글, 댓글, 대댓글, 좋아요, 신고 기능의 API 설계 및 구현을 담당했습니다. 인증 구조 연동, 응답 DTO 개선, 예외 처리, Docker 기반 실행 환경 이해와 배포 구조 파악에도 참여했습니다.",
    },
    architecture: {
      diagram: "/images/backend_arc.png",
      description:
        "React Native 기반 모바일 앱의 요청을 Spring Boot 백엔드가 처리하고, OAuth2 + JWT + Spring Security 기반 인증, Redis/MySQL 데이터 처리, 뉴스 크롤링 스케줄러와 분석 서비스 연동 구조로 구성했습니다.",
      reasoning:
        "인증, API, 스케줄링을 Spring Boot 중심으로 통합해 개발 생산성과 유지보수성을 확보했습니다. Redis와 MySQL을 분리해 빠른 접근과 영속 데이터 저장 역할을 분담했고, 크롤링과 분석 기능을 분리해 기능 확장성과 책임 분리를 확보했습니다. Docker Compose를 통해 실행 환경을 통일하고 배포 재현성을 확보했습니다.",
    },
    techStack: [
      {
        name: "Spring Boot",
        role: "REST API 및 전체 백엔드 애플리케이션 구현",
        reason:
          "인증, 데이터 접근, 예외 처리, 구조화된 서버 개발에 적합하며 팀 전체가 익숙한 생태계였기 때문에 선택했습니다.",
      },
      {
        name: "Spring Security / OAuth2 / JWT",
        role: "로그인 및 인증/인가 처리",
        reason:
          "토큰 기반 인증 구조를 안정적으로 구현할 수 있고, Spring Boot와의 통합이 자연스러워 선택했습니다.",
      },
      {
        name: "JPA / MySQL",
        role: "게시글, 댓글, 신고 등 핵심 데이터 저장",
        reason:
          "관계형 데이터 모델링과 CRUD 개발에 적합하고, 데이터 간 연관관계를 명확하게 표현할 수 있어 선택했습니다.",
      },
      {
        name: "Redis",
        role: "빠른 데이터 접근 보조",
        reason:
          "DB 부하를 줄이고 응답 성능을 보완하기 위해 사용했습니다. 인메모리 특성상 자주 조회되는 데이터 캐싱에 적합했습니다.",
      },
      {
        name: "Selenium + Scheduler",
        role: "뉴스 크롤링 자동화",
        reason:
          "주기적인 데이터 수집 작업을 사용자 요청과 분리하기 위해 스케줄러 기반으로 구성했습니다.",
      },
      {
        name: "Docker Compose",
        role: "개발/배포 실행 환경 통일",
        reason:
          "팀원 간 환경 차이로 인한 오류를 줄이고 재현 가능한 실행 환경을 만들기 위해 사용했습니다.",
      },
      {
        name: "GitHub Actions",
        role: "빌드 및 배포 자동화",
        reason:
          "수동 배포를 줄이고 반복 가능한 배포 흐름을 만들기 위해 도입했습니다.",
      },
    ],
    problemSolving: [
      {
        issue: "팀원별 개발환경 차이로 인해 같은 코드도 실행 결과가 다르게 나오는 문제가 자주 발생했습니다.",
        analysis:
          "문제의 원인은 기능 코드 자체보다 Java 버전, 의존성, 실행 방식 차이 등 환경 불일치에 있었습니다.",
        solution:
          "Docker를 단순 배포 도구가 아니라 개발환경을 표준화하는 도구로 보고 실행 환경을 통일하는 방향으로 접근했습니다. Docker Compose로 전체 스택의 실행 환경을 코드로 정의해 팀 전체가 동일한 환경에서 개발하도록 기준을 세웠습니다.",
        result:
          "환경 차이로 인한 오류를 줄이는 기준을 세울 수 있었고, 협업에서 실행 환경 통일의 중요성을 체감했습니다.",
      },
    ],
    retrospective: {
      improvements:
        "게시글, 댓글, 좋아요, 신고 등 커뮤니티 핵심 기능을 안정적으로 구현했고, 뉴스 크롤링 및 분석 서비스 연동 구조를 통해 단순 CRUD를 넘어선 백엔드 아키텍처를 경험했습니다.",
      regrets:
        "초반에는 Docker를 배포용으로만 생각해 개발환경 통일에 적극적으로 활용하지 못했고, 그 결과 환경 차이로 인한 오류 대응에 시간이 많이 들었습니다.",
      futureWork:
        "서비스 규모가 커진다면 크롤링, 분석, API 서버를 더 분리하고, 비동기 처리, 캐시 전략 고도화, 모니터링 체계 강화까지 확장할 계획입니다.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/Newgnal-Backend",
      demo: "/images/tave_pdf.pdf", // PDF 링크
    },
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC 인프라",
    period: "2026.02 ~ 2026.03",
    overview: {
      description:
        "EKS 기반 애플리케이션 플랫폼과 Central VPC 중앙 관제 네트워크를 설계·구축했습니다. QA 환경에서 2,000 RPS · 12만 요청을 처리하며 구조의 유효성을 검증했습니다.",
      role: "팀장으로서 전체 일정과 방향을 조율했고, 기술적으로는 쿠버네티스 중심 아키텍처 설계와 EKS 학습·구축을 주도했습니다. 일부 모니터링 및 알림 체계 구성에도 참여했습니다.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "전체 구조는 Prod / QA / Dev / DR / Central VPC로 나뉩니다. Prod와 QA는 공통적으로 CloudFront → ALB(Ingress) → Kubernetes Service → Pod 흐름의 EKS 기반 구조를 사용했고, 가용성을 위해 멀티 AZ로 구성했습니다. 데이터 계층은 Aurora DB + Reader Endpoint + RDS Proxy로 설계해 읽기 트래픽 분산과 커넥션 안정성을 확보했습니다. Prod는 On-Demand + Spot NodePool 분리 운영, QA는 비용 절감을 위해 Spot 중심으로 운영했습니다. Central VPC에는 GitLab 서버와 모니터링 스택 서버를 두어 여러 환경을 한 곳에서 관리하는 중앙 관제형 구조를 만들었고, DR은 Pilot Light 방식으로 설계해 평시 비용을 줄이고 필요 시 복구 가능한 형태로 구성했습니다. DNS 질의 흐름은 Route 53 Resolver → DNS Firewall(ALERT) → Query Logging → CloudWatch Logs → Metric Filter → Alarm → SNS → Lambda → Slack Alert로 연결해 외부 도메인 접근을 추적할 수 있도록 구성했습니다.",
      reasoning:
        "EKS를 선택한 이유는 단순 배포 편의성보다 확장성과 생태계 활용성 때문이었습니다. KEDA·Karpenter·IRSA 등 오픈소스와의 연계성이 뛰어났고, Helm Chart로 배포와 운영 구성을 일관되게 관리할 수 있었습니다. Central VPC는 공통 서비스를 중앙화해 운영 복잡도를 낮추고, 여러 VPC의 상태·로그·알람을 한 곳에서 모아 가시성과 장애 대응 속도를 높이는 구조로 설계했습니다. 즉 '네트워크를 나눈 설계'가 아니라 운영·보안·관측 포인트를 줄인 설계입니다.",
    },
    techStack: [
      {
        name: "Terraform",
        role: "인프라 리소스 프로비저닝 및 DR 재현성 확보",
        reason:
          "인프라를 코드로 관리해 수동 구성 오류를 줄이고, DR에서도 Pilot Light 구조를 재현 가능한 형태로 가져가기 위해 선택했습니다.",
      },
      {
        name: "AWS EKS",
        role: "애플리케이션 실행 및 오케스트레이션 플랫폼",
        reason:
          "트래픽 변동 대응, 오토스케일링, 모니터링, GitOps, 오픈소스 연동 등 운영 요구사항이 많은 구조에 적합했고, KEDA·Karpenter·IRSA 등과의 연계성이 뛰어났기 때문입니다.",
      },
      {
        name: "KEDA",
        role: "요청량 기반 Pod 오토스케일링",
        reason:
          "CPU/메모리 기준보다 실제 요청량 기준 확장이 더 적합하다고 판단해, Prometheus 메트릭을 기반으로 Pod당 평균 RPS를 계산해 확장하도록 설계했습니다. 최소 45개, 최대 110개까지 확장 가능하게 구성했습니다.",
      },
      {
        name: "Karpenter",
        role: "노드 레벨 오토스케일링",
        reason:
          "Pod 수만 늘려서는 충분하지 않고, 실제 스케줄링 가능한 노드가 함께 늘어나야 했기 때문에 사용했습니다. Pending Pod 감지 후 필요한 노드를 자동으로 생성하는 구조를 설계했습니다.",
      },
      {
        name: "ArgoCD / GitOps",
        role: "선언형 배포 상태 관리",
        reason:
          "Git 기준으로 배포 상태를 일관되게 유지하고, 운영 변경 이력을 명확하게 관리하기 위해 도입했습니다.",
      },
      {
        name: "Helm",
        role: "애플리케이션 및 운영 스택 배포 표준화",
        reason:
          "앱 배포, 모니터링 스택, 오토스케일링 관련 설정을 일관되게 관리하기 위해 사용했습니다.",
      },
      {
        name: "Prometheus",
        role: "메트릭 수집 및 스케일링 판단 기준 제공",
        reason:
          "/actuator/prometheus 메트릭을 수집해 KEDA가 요청량 기반으로 스케일링 결정을 내릴 수 있게 만들기 위해 사용했습니다.",
      },
      {
        name: "IRSA",
        role: "Pod 단위 AWS 권한 분리",
        reason:
          "노드 전체 IAM Role에 권한을 몰아주지 않고, ServiceAccount 단위로 필요한 권한만 부여해 보안 범위를 최소화하기 위해 적용했습니다.",
      },
      {
        name: "Route 53 Resolver / DNS Firewall / CloudWatch / SNS / Lambda",
        role: "DNS 보안 관측 및 알림 자동화",
        reason:
          "Central VPC 내부 서버의 외부 도메인 접근을 추적하고, 위험 도메인 탐지 이벤트를 Slack으로 빠르게 전달하기 위해 구성했습니다.",
      },
    ],
    problemSolving: [
      {
        issue: "대규모 부하 상황에서 준비되지 않은 Pod에 트래픽이 들어갈 위험, 요청량에 비해 느린 확장, Pod는 늘어나지만 노드가 부족해 Pending이 발생할 위험이 함께 존재했습니다. 실제로 노드 Join 실패, Pending Pod, MaxPods 한계, ALB 헬스체크 경로 불일치 같은 문제가 반복적으로 나타났습니다.",
        analysis:
          "문제를 레이어별로 분리해 분석했습니다. Spring Boot는 부팅 직후 바로 요청을 받으면 안 되기 때문에 readiness 기준이 중요했고, HPA만으로는 실제 요청량을 충분히 반영하기 어려웠습니다. 또한 Private Subnet 라우팅 오류로 워커 노드가 EKS API와 통신하지 못해 Join에 실패했고, DNS 설정 오류로 Node가 NotReady가 되었으며, MaxPods 한계로 Pending Pod가 발생하는 문제를 확인했습니다.",
        solution:
          "단일 기술이 아닌 여러 계층을 맞물리게 설계했습니다. startup/readiness/liveness probe를 분리하고 ALB health check 경로를 readiness와 동일하게 맞췄습니다. CPU 기준 대신 Prometheus 메트릭 기반 KEDA로 Pod당 평균 RPS를 기준으로 스케일링하도록 했고, 최소 45개 Pod를 선기동해 초기 수용량을 확보했습니다. Karpenter를 함께 적용해 Pending Pod 발생 시 새 노드가 자동으로 추가되도록 했으며, IRSA로 Pod 단위 권한을 분리했습니다.",
        result:
          "QA 환경에서 약 2,000 RPS를 60초 동안 유지하며 총 120,000 요청을 처리했습니다. 초기 45개 Pod 확보, readiness/ALB health check 기준 통일, Prometheus 기반 KEDA 확장, Karpenter 기반 노드 확장, GitOps 기반 운영 일관성이 함께 작동한 결과였습니다.",
      },
    ],
    retrospective: {
      improvements:
        "EKS 기반 대규모 트래픽 대응 구조를 실제 요청으로 검증했습니다. Central VPC를 통해 GitLab·모니터링·보안 관측을 중앙화해 운영 복잡도를 낮추고 가시성을 높였으며, DNS Firewall + Query Logging + Slack Alert를 통해 네트워크 보안 이벤트를 탐지하고 즉시 인지할 수 있는 흐름을 만들었습니다.",
      regrets:
        "부하 테스트 과정에서 리소스 스펙을 충분히 정교하게 잡지 못해 예산을 초과했습니다. 또한 Karpenter를 완전한 GitOps 흐름 안에 넣지 못했고, DNS Firewall도 ALERT 모드 위주로만 사용해 차단 정책까지는 확장하지 못했습니다.",
      futureWork:
        "Karpenter까지 포함한 완전한 GitOps화, Central VPC 보안 정책의 BLOCK/탐지 규칙 고도화, 부하 테스트 기반 비용 예측 정교화를 다음 단계로 진행할 계획입니다.",
    },
    links: {
      blog: "https://velog.io/@eomkyeongmun/series/CJ-%EC%98%AC%EB%A6%AC%EB%B8%8C%EB%84%A4%ED%8A%B8%EC%9B%8D%EC%8A%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    },
  },
  {
    category: "devops",
    title: "개인 포트폴리오 사이트 구축",
    period: "2026.03 ~ 진행 중",
    thumbnail: "/images/Gemini_Generated_Image_22lrqw22lrqw22lr.png",
    overview: {
      description:
        "Next.js 기반 개인 포트폴리오 웹사이트. 웹 열람용 페이지와 PDF 다운로드를 함께 제공하며, S3 + CloudFront + Lambda 서버리스 구조로 AWS에 직접 배포·운영합니다.",
      role: "Next.js 프론트엔드 개발, Tailwind CSS 디자인, Puppeteer 기반 PDF 생성, Terraform IaC 인프라 구축, GitHub Actions CI/CD 파이프라인 구성까지 전 과정 단독 담당",
    },
    architecture: {
      diagram: "/images/Gemini_Generated_Image_22lrqw22lrqw22lr.png",
      description:
        "사용자는 외부 DNS(CNAME) → CloudFront(OAC) → S3 경로로 정적 페이지를 제공받습니다. PDF 다운로드 요청은 CloudFront → API Gateway → Lambda(Puppeteer) 흐름으로 처리됩니다. CloudFront 앞단에 WAF를 배치해 L7 보안을 확보했고, Response Headers Policy로 HSTS·X-Frame-Options 등 보안 헤더를 모든 응답에 자동 추가합니다. ACM으로 HTTPS 인증서를 관리하고, Lambda는 ECR에 저장된 컨테이너 이미지로 실행됩니다. X-Ray로 API Gateway ~ Lambda 구간의 분산 추적을 구성했으며, CloudWatch 대시보드와 SNS 알람으로 Lambda 오류·Duration·Throttle, API Gateway 5xx를 실시간 감지합니다. GitHub Actions가 코드 변경 시 S3 업로드 → CloudFront 캐시 무효화, Lambda 이미지 빌드 → ECR 푸시 → 함수 업데이트를 자동으로 수행합니다.",
      reasoning:
        "PDF 생성처럼 간헐적으로 발생하는 무거운 작업을 상시 서버 없이 Lambda로 분리해 운영 비용을 최소화했습니다. 정적 콘텐츠는 CloudFront + S3로 글로벌 캐싱하고, 서버가 필요한 기능만 서버리스로 붙이는 구조로 단순성과 비용 효율을 동시에 확보했습니다. 모든 인프라는 Terraform으로 코드화해 재현성과 변경 이력 관리를 확보했습니다.",
    },
    techStack: [
      {
        name: "Next.js 16 / React / TypeScript",
        role: "포트폴리오 웹 페이지 및 PDF 전용 렌더링 페이지 구현",
        reason:
          "App Router 기반 정적 생성(SSG)으로 S3 배포에 최적화되고, TypeScript로 데이터 구조를 타입 안전하게 관리할 수 있었습니다. Tailwind CSS v4와의 궁합도 선택 이유 중 하나였습니다.",
      },
      {
        name: "Tailwind CSS v4",
        role: "반응형 UI 스타일링",
        reason:
          "CSS-first 설정 방식으로 설정 파일 없이 globals.css에서 바로 커스텀 테마를 정의할 수 있었고, 다크 모드 지원이 클래스 기반으로 간단하게 구현됩니다.",
      },
      {
        name: "AWS S3 + CloudFront + OAC",
        role: "정적 파일 원본 저장 및 글로벌 CDN 배포",
        reason:
          "S3를 퍼블릭으로 열지 않고 OAC(Origin Access Control)로 CloudFront에서만 접근 가능하도록 구성해 보안을 강화했습니다. 직접 도메인 DNS는 외부 공급자에서 관리하며 CNAME으로 CloudFront에 연결했습니다.",
      },
      {
        name: "AWS WAF",
        role: "CloudFront 앞단 L7 보안",
        reason:
          "관리형 규칙셋으로 SQL 인젝션, XSS 등 일반적인 웹 공격을 차단하고, 개인 포트폴리오임에도 기본 보안 레이어를 갖추기 위해 적용했습니다.",
      },
      {
        name: "AWS Lambda + Puppeteer (컨테이너)",
        role: "서버리스 PDF 생성",
        reason:
          "Puppeteer는 Chromium 바이너리가 필요해 일반 Lambda 패키지 크기 제한을 초과합니다. 컨테이너 이미지 기반 Lambda로 배포해 이 제약을 해결했습니다. PDF 생성은 간헐적 요청이므로 상시 서버 대신 Lambda가 비용 효율적입니다.",
      },
      {
        name: "AWS API Gateway",
        role: "Lambda 호출 HTTP 엔드포인트",
        reason:
          "CloudFront에서 Lambda를 직접 호출하는 대신 API Gateway를 두어 요청 라우팅, 인증 확장, X-Ray 추적 연동을 용이하게 했습니다.",
      },
      {
        name: "AWS ECR",
        role: "Lambda 컨테이너 이미지 저장소",
        reason:
          "Lambda 컨테이너 배포에 필요한 이미지를 AWS 내부 레지스트리에서 관리해 배포 지연을 최소화하고 이미지 버전 관리를 체계화했습니다.",
      },
      {
        name: "AWS X-Ray",
        role: "API Gateway → Lambda 구간 분산 추적",
        reason:
          "단순 에러 로그로는 파악하기 어려운 Lambda Cold Start 지연, Puppeteer 렌더링 구간 병목을 시각화해 성능 문제의 원인을 특정하기 위해 도입했습니다.",
      },
      {
        name: "Terraform",
        role: "전체 인프라 IaC 관리",
        reason:
          "CloudFront, S3, WAF, API Gateway, Lambda, ECR, ACM, IAM 등 모든 리소스를 코드로 정의해 콘솔 수동 작업 없이 재현 가능한 인프라를 유지했습니다. 모듈 단위로 분리해 환경별 확장을 고려했습니다.",
      },
      {
        name: "GitHub Actions",
        role: "프론트엔드 및 Lambda 배포 자동화",
        reason:
          "코드 push 시 Next.js 빌드 → S3 업로드 → CloudFront 캐시 무효화, Lambda 이미지 빌드 → ECR 푸시 → Lambda 함수 업데이트를 자동화해 수동 배포를 완전히 제거했습니다.",
      },
      {
        name: "CloudWatch + SNS",
        role: "운영 모니터링 및 알람",
        reason:
          "Lambda 오류·Duration 임계값 초과·Throttle, API Gateway 5xx를 CloudWatch Alarm으로 감지하고 SNS 이메일 구독으로 즉시 알림을 받도록 구성했습니다. 대시보드로 호출 추이·지연 시간을 한눈에 확인할 수 있어 장애 대응 속도를 높였습니다.",
      },
      {
        name: "CloudFront Response Headers Policy",
        role: "보안 헤더 자동 삽입",
        reason:
          "CloudFront Function 없이 AWS 관리형 정책으로 HSTS(2년)·X-Frame-Options·X-Content-Type-Options·XSS-Protection·Referrer-Policy·Permissions-Policy를 모든 응답에 일괄 적용해 코드 유지보수 없이 보안 레이어를 완성했습니다.",
      },
    ],
    problemSolving: [
      {
        issue: "Lambda에서 Puppeteer로 PDF를 생성할 때 한글 텍스트가 □□□ 로 깨지는 문제가 발생했습니다.",
        analysis:
          "Puppeteer가 사용하는 Chromium은 시스템 폰트에 의존합니다. Lambda 실행 환경(Amazon Linux 2)에는 한글 폰트가 기본 설치되어 있지 않아, 한글 문자를 렌더링할 폰트를 찾지 못하고 □로 출력했습니다.",
        solution:
          "Lambda 컨테이너 이미지 Dockerfile에 Noto Sans KR 폰트를 직접 포함시켜 빌드했습니다. 또한 /portfolio/print 페이지에서 Google Fonts로 폰트를 로드하고, Puppeteer가 폰트 로딩 완료를 기다린 후 PDF를 캡처하도록 waitForFunction을 추가했습니다.",
        result:
          "한글 폰트가 정상적으로 렌더링되어 PDF에서 모든 텍스트가 올바르게 출력됩니다. 폰트를 이미지에 번들링해 외부 네트워크 의존 없이 일관된 결과를 보장합니다.",
      },
      {
        issue: "GitHub Actions에서 Lambda 컨테이너 이미지를 ECR에 푸시한 뒤 Lambda 함수가 새 이미지를 반영하지 않는 경우가 있었습니다.",
        analysis:
          "ECR에 latest 태그로 이미지를 push해도 Lambda는 함수 설정이 변경되지 않으면 기존에 캐시된 이미지를 계속 사용합니다. Lambda가 새 이미지를 인식하려면 함수 자체를 업데이트하는 API 호출이 필요합니다.",
        solution:
          "GitHub Actions 워크플로에 ECR 푸시 후 aws lambda update-function-code 단계를 추가해 매 배포마다 Lambda가 최신 ECR 이미지를 참조하도록 강제했습니다.",
        result:
          "코드 push 시 Lambda가 항상 최신 이미지로 업데이트됩니다. 배포 누락 없이 변경 사항이 즉시 반영됩니다.",
      },
    ],
    retrospective: {
      improvements:
        "프론트엔드 개발부터 서버리스 백엔드, IaC, CI/CD까지 하나의 서비스를 혼자서 끝까지 구축하며 전체 흐름을 직접 연결했습니다. S3 OAC, WAF, X-Ray, CloudWatch 알람, 보안 헤더 정책까지 실제 운영 수준의 보안·관측 레이어를 단계적으로 추가하며 단순 배포를 넘어선 구조를 완성했습니다.",
      regrets:
        "Lambda Cold Start 지연이 PDF 생성 첫 요청에서 체감될 수 있는데, Provisioned Concurrency 적용 여부를 충분히 검토하지 못했습니다. Terraform 모듈 구조도 초기 설계보다 복잡해져 리팩터링이 필요한 상태입니다.",
      futureWork:
        "Lambda Provisioned Concurrency 또는 SnapStart 적용으로 Cold Start를 줄이고, CloudWatch 알람과 연동한 이상 트래픽 탐지 체계를 추가할 계획입니다. Terraform 모듈도 환경별 재사용 가능한 구조로 정리할 예정입니다.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
    },
  },
];
