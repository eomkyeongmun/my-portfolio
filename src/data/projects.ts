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
  category: "backend" | "infrastructure" | "devops" | "ai";
  title: string;
  period: string; // 예: "2023.01 ~ 2023.06"
  overview: {
    description: string;
    role: string;
  };
  thumbnail?: string; // 홈 카드 썸네일 (없으면 architecture.diagram 사용)
  confidential?: boolean; // 사내 프로젝트 등 코드 비공개 여부 (GitHub 링크 대신 비공개 배지 노출)
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
    velog?: string;
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
    category: "ai",
    title: "자동차 사이버보안 RAG 시스템",
    period: "2026.03 ~ 2026.06",
    thumbnail: "/images/rag_arch.svg",
    confidential: true,
    overview: {
      description:
        "ISO/SAE 21434, UN R155, 내부 TARA 표를 근거로 자동차 사이버보안 질의에 답하는 RAG 시스템입니다. TARA 자동화 도구(tAIRA)가 분석 단계마다 호출해 근거 컨텍스트를 받아갑니다.",
      role:
        "BGE-M3 임베딩, FAISS 하이브리드 검색, cross-encoder 재정렬, Ollama 기반 한국어 답변까지 RAG 파이프라인 전체를 단독으로 설계·구현했습니다.",
    },
    architecture: {
      diagram: "/images/rag_arch.svg",
      description:
        "질문을 dense+sparse로 임베딩해 FAISS로 후보를 뽑고, sparse 점수와 0.7/0.3으로 결합한 뒤 cross-encoder로 상위 5개를 재정렬해 Ollama(qwen2.5:3b)에 근거로 넣어 한국어 답변을 만듭니다. 문서는 오프라인에서 청킹·임베딩해 증분 인덱싱합니다.",
      reasoning:
        "식별자·표준 번호의 정확 매칭과 의미 검색을 모두 잡기 위해 dense와 sparse를 함께 쓰는 하이브리드 검색을 택했고, 비용이 큰 cross-encoder는 상위 소수에만 적용했습니다. 민감한 TARA 데이터를 외부로 보낼 수 없어 LLM은 사내 Ollama로 구성했습니다.",
    },
    techStack: [
      {
        name: "BGE-M3",
        role: "dense+sparse 임베딩",
        reason: "한 모델로 의미 검색과 식별자 정확 매칭을 동시에 처리하기 위해 선택했습니다.",
      },
      {
        name: "FAISS",
        role: "벡터 인덱스·후보 검색",
        reason: "별도 벡터DB 서버 없이 파일 기반으로 가볍게 dense 검색을 수행하기 위해 사용했습니다.",
      },
      {
        name: "Cross-Encoder Reranker",
        role: "후보 재정렬",
        reason: "질문과 청크를 함께 입력해 1차 검색이 놓치는 관련도 차이를 보정하도록 상위 20개에만 적용했습니다.",
      },
      {
        name: "Ollama (qwen2.5:3b)",
        role: "한국어 답변 생성",
        reason: "민감 문서를 외부 API로 보낼 수 없어 사내 로컬 LLM으로 구성했습니다.",
      },
      {
        name: "FastAPI",
        role: "질의 API·tAIRA 연동",
        reason: "동기 추론을 스레드풀로 분리해 동시 요청을 처리하며 tAIRA와 연동했습니다.",
      },
      {
        name: "Docker Compose",
        role: "배포·데이터 분리",
        reason: "공개 문서는 이미지에, 민감한 TARA·인덱스는 호스트 볼륨으로 분리해 배포했습니다.",
      },
    ],
    problemSolving: [
      {
        issue:
          "표준·위협 식별자(M013-1, ISO 15.4 등)를 묻는 질의에서 정작 해당 항목을 정확히 찾지 못했습니다.",
        analysis:
          "의미 임베딩은 식별자처럼 의미가 적은 토큰을 잘 구분하지 못했고, reranker는 식별자를 서브워드로 쪼개 정확 매칭을 오히려 약화시켰습니다.",
        solution:
          "dense 점수에 sparse 점수를 0.7/0.3으로 결합해 정확 토큰 매칭을 보강하고, ID 패턴이 감지되면 reranker를 우회한 뒤 sparse 정확 매칭을 부스트하도록 분기했습니다.",
        result:
          "식별자 질의는 해당 항목이 안정적으로 상위에 노출되고, 일반 질의는 기존대로 reranker를 거쳐 관련도를 유지했습니다.",
      },
      {
        issue:
          "추론 호출(임베딩·FAISS·reranker·Ollama)이 모두 동기 블로킹이라 FastAPI async 핸들러에서 동시 요청을 받지 못했습니다.",
        analysis:
          "비동기 인터페이스가 없는 추론 호출을 async 함수에서 직접 부르면 작업이 끝날 때까지 이벤트 루프가 멈추는 것이 원인이었습니다.",
        solution:
          "블로킹 호출을 asyncio.to_thread로 스레드풀에 위임하고, RAG 실패 시 빈 컨텍스트로 graceful degradation 하도록 tAIRA 연동을 설계했습니다.",
        result:
          "동시 질의에서 이벤트 루프 블로킹이 사라졌고, RAG가 실패해도 tAIRA의 TARA 분석은 중단 없이 진행됩니다.",
      },
    ],
    retrospective: {
      improvements:
        "임베딩·하이브리드 검색·재정렬·로컬 LLM으로 이어지는 RAG 파이프라인을 처음부터 끝까지 설계하며 정확 매칭과 증분 인덱싱까지 운영을 고려해 구성했습니다.",
      regrets:
        "검색 품질을 수치로 평가하는 지표(recall@k 등)를 갖추지 못해 튜닝이 정성 판단에 의존했습니다.",
      futureWork:
        "평가 하니스를 도입해 튜닝을 정량화하고, 인덱스 재빌드·배포를 GitOps로 자동화할 계획입니다.",
    },
    links: {},
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC 인프라",
    period: "2026.02 ~ 2026.03",
    overview: {
      description:
        "EKS 기반 애플리케이션 플랫폼과 Central VPC 중앙 관제 네트워크를 설계·구축했습니다. QA 환경에서 2,000 RPS · 12만 요청을 처리하며 구조의 유효성을 검증했습니다.",
      role: "팀장으로 전체 일정과 방향을 조율하고, 쿠버네티스 중심 아키텍처 설계와 EKS 구축을 주도했습니다.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "Prod / QA / Dev / DR / Central VPC로 환경을 나누고, Prod·QA는 CloudFront → ALB(Ingress) → EKS Pod 흐름을 멀티 AZ로 구성했습니다. 데이터 계층은 Aurora + RDS Proxy로 읽기 분산과 커넥션 안정성을 확보했고, Central VPC에 GitLab·모니터링·DNS 보안 관측을 모아 중앙 관제형으로 운영했습니다. DR은 Pilot Light로 설계해 평시 비용을 줄였습니다.",
      reasoning:
        "EKS는 KEDA·Karpenter·IRSA 등 오픈소스 연계성과 Helm 기반 일관된 운영 때문에 선택했습니다. Central VPC는 공통 서비스를 중앙화해 운영 복잡도를 낮추고 여러 환경의 로그·알람을 한 곳에서 보기 위한 설계입니다.",
    },
    techStack: [
      {
        name: "Terraform",
        role: "인프라 프로비저닝·DR 재현성",
        reason: "인프라를 코드로 관리해 수동 오류를 줄이고 Pilot Light DR을 재현 가능하게 가져가기 위해 선택했습니다.",
      },
      {
        name: "AWS EKS",
        role: "애플리케이션 실행·오케스트레이션",
        reason: "오토스케일링·GitOps·오픈소스 연동 요구가 많은 구조에 적합해 선택했습니다.",
      },
      {
        name: "KEDA",
        role: "요청량 기반 Pod 오토스케일링",
        reason: "CPU 대신 Prometheus 기반 Pod당 평균 RPS로 확장하도록 구성했습니다 (최소 45 ~ 최대 110).",
      },
      {
        name: "Karpenter",
        role: "노드 레벨 오토스케일링",
        reason: "Pending Pod 감지 시 필요한 노드를 자동 생성해 Pod 확장과 노드 확장을 함께 맞췄습니다.",
      },
      {
        name: "ArgoCD / GitOps",
        role: "선언형 배포 상태 관리",
        reason: "Git 기준으로 배포 상태와 운영 변경 이력을 일관되게 관리하기 위해 도입했습니다.",
      },
      {
        name: "IRSA",
        role: "Pod 단위 AWS 권한 분리",
        reason: "ServiceAccount 단위로 필요한 권한만 부여해 보안 범위를 최소화했습니다.",
      },
    ],
    problemSolving: [
      {
        issue:
          "대규모 부하에서 준비 안 된 Pod로 트래픽이 들어가거나, 요청량 대비 확장이 느리고, Pod는 늘어도 노드가 부족해 Pending이 발생할 위험이 있었습니다.",
        analysis:
          "Spring Boot는 부팅 직후 요청을 받으면 안 돼 readiness 기준이 중요했고, HPA만으로는 실제 요청량을 반영하기 어려웠습니다.",
        solution:
          "startup/readiness/liveness probe를 분리하고 ALB health check를 readiness와 일치시켰습니다. Prometheus 기반 KEDA로 Pod당 평균 RPS 기준 확장하고 최소 45개 Pod를 선기동했으며, Karpenter로 Pending 시 노드를 자동 확장했습니다.",
        result:
          "QA에서 약 2,000 RPS를 60초간 유지하며 총 12만 요청을 무중단 처리했습니다.",
      },
      {
        issue:
          "워커 노드가 EKS API와 통신하지 못해 Join에 실패하거나 NotReady가 되고, MaxPods 한계로 Pending이 발생했습니다.",
        analysis:
          "Private Subnet 라우팅 오류와 DNS 설정 오류로 노드가 컨트롤플레인과 통신하지 못한 것이 원인이었습니다.",
        solution:
          "서브넷 라우팅과 DNS 설정을 바로잡고 MaxPods·인스턴스 타입을 조정해 노드가 정상 Join되도록 했습니다.",
        result:
          "노드 Join 실패와 Pending 문제가 해소되어 오토스케일링이 안정적으로 동작했습니다.",
      },
    ],
    retrospective: {
      improvements:
        "EKS 기반 대규모 트래픽 대응 구조를 실제 요청으로 검증하고, Central VPC로 GitLab·모니터링·DNS 보안 관측을 중앙화했습니다.",
      regrets:
        "부하 테스트에서 리소스 스펙을 정교하게 잡지 못해 예산을 초과했고, Karpenter를 완전한 GitOps 흐름에 넣지 못했습니다.",
      futureWork:
        "Karpenter까지 포함한 완전한 GitOps화와 DNS Firewall 차단 정책 고도화를 진행할 계획입니다.",
    },
    links: {
      velog: "https://velog.io/@eomkyeongmun/series/CJ-%EC%98%AC%EB%A6%AC%EB%B8%8C%EB%84%A4%ED%8A%B8%EC%9B%8D%EC%8A%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    },
  },
  {
    category: "devops",
    title: "개인 포트폴리오 사이트 구축",
    period: "2026.03 ~",
    thumbnail: "/images/real.png",
    overview: {
      description:
        "Next.js 기반 개인 포트폴리오 웹사이트. 웹 열람용 페이지, PDF 다운로드, 방문자 피드백 수신 기능을 함께 제공하며, S3 + CloudFront + Lambda 서버리스 구조로 AWS에 직접 배포·운영합니다.",
      role: "Next.js 프론트엔드, Puppeteer 기반 PDF 생성, 피드백 알림 시스템, Terraform IaC, GitHub Actions CI/CD까지 전 과정 단독 담당.",
    },
    architecture: {
      diagram: "/images/real.png",
      description:
        "정적 페이지는 CloudFront(OAC) → S3로 서빙하고, PDF 생성과 피드백 제출은 API Gateway → Lambda로 처리합니다. 피드백은 EventBridge로 이메일 발송 Lambda와 느슨하게 연결했고, WAF·보안 헤더·X-Ray·CloudWatch 알람으로 보안과 관측을 확보했습니다. GitHub Actions가 S3 업로드·캐시 무효화와 Lambda 이미지 배포를 자동화합니다.",
      reasoning:
        "PDF 생성처럼 간헐적인 무거운 작업을 상시 서버 없이 Lambda로 분리해 비용을 최소화하고, 정적 콘텐츠는 CloudFront+S3로 캐싱했습니다. 모든 인프라는 Terraform으로 코드화해 재현성을 확보했습니다.",
    },
    techStack: [
      {
        name: "Next.js 16 / React / TypeScript",
        role: "웹 페이지·PDF 렌더링 페이지 구현",
        reason: "App Router 정적 생성(SSG)으로 S3 배포에 최적화되고 데이터 구조를 타입 안전하게 관리할 수 있었습니다.",
      },
      {
        name: "AWS S3 + CloudFront + OAC",
        role: "정적 파일 저장·글로벌 CDN",
        reason: "S3를 퍼블릭으로 열지 않고 OAC로 CloudFront에서만 접근 가능하게 구성해 보안을 강화했습니다.",
      },
      {
        name: "AWS Lambda + Puppeteer (컨테이너)",
        role: "서버리스 PDF 생성",
        reason: "Chromium 바이너리로 패키지 크기 제한을 넘기는 문제를 컨테이너 이미지 Lambda로 해결했고, 간헐적 요청에 비용 효율적입니다.",
      },
      {
        name: "AWS API Gateway",
        role: "Lambda 호출 HTTP 엔드포인트",
        reason: "요청 라우팅·인증 확장·X-Ray 추적 연동을 위해 Lambda 앞에 두었습니다.",
      },
      {
        name: "Amazon EventBridge + SES",
        role: "피드백 이벤트 처리·이메일 알림",
        reason: "수신 Lambda와 발송 Lambda를 EventBridge로 느슨하게 분리해 Slack·DB 등 확장 시 Rule만 추가하면 되도록 했습니다.",
      },
      {
        name: "Terraform",
        role: "전체 인프라 IaC",
        reason: "CloudFront·S3·WAF·API Gateway·Lambda 등 모든 리소스를 코드로 정의해 재현 가능한 인프라를 유지했습니다.",
      },
      {
        name: "GitHub Actions",
        role: "프론트·Lambda 배포 자동화",
        reason: "push 시 빌드 → S3 업로드 → 캐시 무효화, Lambda 이미지 빌드·배포를 자동화해 수동 배포를 제거했습니다.",
      },
    ],
    problemSolving: [
      {
        issue: "Lambda에서 Puppeteer로 PDF를 생성할 때 한글 텍스트가 □□□로 깨졌습니다.",
        analysis:
          "Chromium이 시스템 폰트에 의존하는데 Lambda 실행 환경에 한글 폰트가 없어 렌더링할 폰트를 찾지 못한 것이 원인이었습니다.",
        solution:
          "컨테이너 이미지에 Noto Sans KR을 포함시키고, print 페이지에서 폰트 로딩 완료를 기다린 뒤 PDF를 캡처하도록 waitForFunction을 추가했습니다.",
        result:
          "한글이 정상 렌더링되고, 폰트를 이미지에 번들링해 외부 네트워크 의존 없이 일관된 PDF를 보장합니다.",
      },
      {
        issue: "배포 후 프로젝트 상세에서 뒤로가기/홈 클릭 시 홈 대신 프로젝트 페이지로 다시 리다이렉트됐습니다.",
        analysis:
          "모든 정적 파일에 immutable 캐시를 적용하면서 RSC 페이로드까지 장기 캐시돼, 브라우저가 오래된 라우팅 정보를 참조한 것이 원인이었습니다.",
        solution:
          "S3 업로드 단계에서 HTML·RSC 페이로드에는 no-cache를, 콘텐츠 해시가 붙은 JS·CSS에만 immutable을 적용하도록 Cache-Control을 분리했습니다.",
        result:
          "리다이렉트 문제가 해결되고 정적 에셋의 장기 캐시 효율은 그대로 유지됩니다.",
      },
    ],
    retrospective: {
      improvements:
        "프론트엔드부터 서버리스 백엔드, IaC, CI/CD까지 혼자 끝까지 구축하고 WAF·X-Ray·CloudWatch 알람 등 운영 수준의 보안·관측을 더했습니다.",
      regrets:
        "PDF 첫 요청의 Lambda Cold Start를 충분히 다루지 못했고, Terraform 모듈 구조가 복잡해져 리팩터링이 필요합니다.",
      futureWork:
        "Provisioned Concurrency 또는 SnapStart로 Cold Start를 줄이고, 피드백 시스템을 Slack·DB로 확장할 계획입니다.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
      velog: "https://velog.io/@eomkyeongmun/series/project",
    },
  },
];
