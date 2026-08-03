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
        "뉴스 데이터를 수집·분석해 모바일 앱에 제공하는 커뮤니티 백엔드입니다. 단순 CRUD를 넘어 '크롤링 데이터를 어떻게 사용자에게 전달할 것인가'라는 질문에서 시작한 프로젝트입니다.",
      role: "커뮤니티 핵심 기능(게시글·댓글·좋아요·신고)의 API를 설계·구현하면서, 팀 전체의 개발 환경 표준화까지 주도했습니다. 기능 구현보다 '팀원 모두가 같은 환경에서 개발하는 구조를 어떻게 만들까'에 더 많은 고민을 쏟았습니다.",
    },
    architecture: {
      diagram: "/images/backend_arc.png",
      description:
        "React Native 모바일 앱 → Spring Boot 백엔드 → MySQL/Redis 데이터 계층으로 구성하고, 뉴스 크롤링은 스케줄러로 분리해 사용자 요청 흐름에 영향을 주지 않도록 했습니다.",
      reasoning:
        "처음에는 크롤링도 API 서버 안에 넣으려 했지만, 크롤링이 느려지면 API 응답까지 느려지는 문제를 예상해 스케줄러로 분리했습니다. Redis는 '모든 데이터를 캐싱하자'가 아니라, 좋아요 수처럼 자주 조회되지만 쓰기는 간헐적인 데이터만 골라서 적용했습니다. Docker Compose는 원래 배포용으로만 생각했는데, 팀원마다 Java 버전이 달라 같은 코드가 다르게 동작하는 걸 겪고 나서 개발 환경 자체를 코드로 정의하는 도구로 쓰기로 결정했습니다.",
    },
    techStack: [
      {
        name: "Spring Boot",
        role: "REST API 및 전체 백엔드 애플리케이션 구현",
        reason:
          "Express나 FastAPI도 고려했지만, 팀 4명 모두 Spring 경험이 있어 학습 비용 없이 바로 기능 개발에 집중할 수 있었습니다. 인증·예외 처리·트랜잭션 관리가 프레임워크 수준에서 제공되는 점도 팀 프로젝트에 유리했습니다.",
      },
      {
        name: "Spring Security / OAuth2 / JWT",
        role: "로그인 및 인증/인가 처리",
        reason:
          "세션 기반 인증은 모바일 앱과 맞지 않았고, JWT로 stateless하게 가되 Refresh Token 관리를 Spring Security 필터 체인에 통합해 인증 로직이 컨트롤러로 흩어지지 않게 했습니다.",
      },
      {
        name: "JPA / MySQL",
        role: "게시글, 댓글, 신고 등 핵심 데이터 저장",
        reason:
          "게시글-댓글-대댓글 간 계층 관계와 사용자-좋아요-신고 간 다대다 관계가 명확해서 관계형 모델이 자연스러웠습니다. NoSQL도 검토했지만 신고 집계나 댓글 정렬 등 조건부 쿼리가 많아 RDBMS가 맞다고 판단했습니다.",
      },
      {
        name: "Redis",
        role: "자주 조회되는 데이터 캐싱",
        reason:
          "좋아요 수는 게시글 목록을 볼 때마다 매번 COUNT 쿼리를 날리면 부담이 되는데, 쓰기는 드물어서 Redis에 캐싱하고 좋아요 변경 시에만 갱신하는 구조가 적절했습니다.",
      },
      {
        name: "Selenium + Scheduler",
        role: "뉴스 크롤링 자동화",
        reason:
          "뉴스 사이트가 SPA라 단순 HTTP 요청으로는 콘텐츠를 가져올 수 없어 Selenium을 썼고, 이 작업이 API 응답 속도에 영향을 주지 않도록 Spring Scheduler로 백그라운드 실행하게 분리했습니다.",
      },
      {
        name: "Docker Compose",
        role: "개발/배포 실행 환경 통일",
        reason:
          "팀원 한 명이 Java 17, 다른 한 명이 Java 21을 쓰면서 같은 코드가 다르게 동작하는 걸 겪었습니다. 이후 '코드뿐 아니라 실행 환경도 공유해야 한다'는 결론을 내리고 Docker Compose로 전환했습니다.",
      },
      {
        name: "GitHub Actions",
        role: "빌드 및 배포 자동화",
        reason:
          "매번 수동으로 빌드·배포하다 보면 '누가 마지막으로 올렸는지' 추적이 안 됐고, PR 머지 시 자동 배포로 바꾸니 배포 실수가 사라졌습니다.",
      },
    ],
    problemSolving: [
      {
        issue: "팀원별 Java 버전과 의존성이 달라 같은 코드인데 실행 결과가 다른 문제가 반복됐습니다.",
        analysis:
          "버그인 줄 알고 코드를 파봤는데, 원인은 코드가 아니라 Java 버전 차이와 로컬 MySQL 설정 차이였습니다. 기능 코드를 아무리 맞춰도 환경이 다르면 의미가 없다는 걸 깨달았습니다.",
        solution:
          "Docker Compose로 Java·MySQL·Redis 전체를 하나의 실행 환경으로 묶어, 'git pull 후 docker compose up 한 번이면 누구나 같은 결과'가 되도록 만들었습니다.",
        result:
          "환경 차이로 인한 디버깅 시간이 거의 사라졌고, 이후 팀원 온보딩도 훨씬 빨라졌습니다.",
      },
    ],
    retrospective: {
      improvements:
        "CRUD를 넘어 크롤링·캐싱·스케줄링이 결합된 구조를 경험했고, 특히 '코드 바깥의 문제(환경 불일치)를 코드로 해결하는 방법'을 배운 프로젝트였습니다.",
      regrets:
        "Docker를 처음부터 개발 환경 도구로 도입했으면 초반 2주간 환경 문제에 쓴 시간을 아낄 수 있었습니다. 문제를 겪고 나서야 움직인 점이 아쉽습니다.",
      futureWork:
        "크롤링과 분석을 별도 서비스로 더 명확히 분리하고, Redis 캐시 전략을 체계화하고 싶습니다. 모니터링 없이 운영한 것도 부족했던 부분입니다.",
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
        "자동차 사이버보안 담당자가 ISO/SAE 21434, UN R155 같은 표준 문서와 내부 TARA 표를 매번 직접 찾아보는 비효율을 없애고 싶어 시작한 RAG 시스템입니다. TARA 자동화 도구(tAIRA)가 분석 단계마다 이 시스템을 호출해 근거 컨텍스트를 받아갑니다.",
      role:
        "임베딩 모델 선정부터 검색 전략, LLM 답변 생성, API 연동까지 RAG 파이프라인 전체를 단독으로 설계·구현했습니다. 특히 '표준 식별자를 정확히 찾는 것'과 '민감 데이터를 외부로 보내지 않는 것' 두 가지 제약 아래에서 어떤 구조가 최선인지 고민하는 과정이 핵심이었습니다.",
    },
    architecture: {
      diagram: "/images/rag_arch.svg",
      description:
        "질문을 dense+sparse로 임베딩해 FAISS로 후보를 뽑고, 두 점수를 0.7/0.3으로 결합한 뒤 cross-encoder로 상위 5개를 재정렬해 Ollama에 근거로 넣어 한국어 답변을 생성합니다. 문서는 오프라인에서 청킹·임베딩해 증분 인덱싱합니다.",
      reasoning:
        "처음에는 dense 검색만으로 충분할 줄 알았는데, 'M013-1 위협은 뭐야?' 같은 식별자 질의에서 엉뚱한 결과가 나왔습니다. 의미 임베딩은 식별자처럼 의미가 없는 코드를 잘 구분하지 못했기 때문입니다. 그래서 sparse 검색을 함께 쓰는 하이브리드 구조로 바꿨고, BGE-M3가 한 모델에서 dense와 sparse를 모두 뽑아줘서 파이프라인을 단순하게 유지할 수 있었습니다. cross-encoder는 정확도가 좋지만 느려서 전체에 적용하면 응답이 수 초가 걸렸고, 상위 20개에만 적용하는 타협점을 찾았습니다. LLM은 GPT-4를 쓰면 성능이 좋겠지만 TARA 데이터가 사내 민감 정보라 외부 API에 보낼 수 없어서, 성능을 어느 정도 포기하고 사내 Ollama로 구성했습니다.",
    },
    techStack: [
      {
        name: "BGE-M3",
        role: "dense+sparse 임베딩",
        reason: "dense 모델과 sparse 모델을 따로 운영하면 파이프라인이 복잡해지는데, BGE-M3는 한 번의 인코딩으로 두 벡터를 모두 뽑아줘서 구조를 단순하게 가져갈 수 있었습니다.",
      },
      {
        name: "FAISS",
        role: "벡터 인덱스·후보 검색",
        reason: "Milvus나 Weaviate 같은 벡터DB도 검토했지만, 문서가 수천 건 수준이라 별도 서버를 띄우는 건 과한 판단이었습니다. 파일 기반 FAISS로 충분했고 배포도 간단했습니다.",
      },
      {
        name: "Cross-Encoder Reranker",
        role: "후보 재정렬",
        reason: "1차 검색 결과의 순위가 만족스럽지 않았는데, cross-encoder로 질문과 청크를 함께 보면 관련도 판단이 훨씬 정확해졌습니다. 다만 전체에 적용하면 너무 느려서 상위 20개로 제한했습니다.",
      },
      {
        name: "Ollama (qwen2.5:3b)",
        role: "한국어 답변 생성",
        reason: "GPT-4가 답변 품질은 좋았지만 TARA 데이터를 외부 API에 보낼 수 없었습니다. 사내에서 돌릴 수 있는 모델 중 한국어 성능이 괜찮은 qwen2.5를 택했고, 3b 사이즈는 응답 속도와 품질의 균형점이었습니다.",
      },
      {
        name: "FastAPI",
        role: "질의 API·tAIRA 연동",
        reason: "tAIRA가 Python 기반이라 같은 언어로 연동하는 게 자연스러웠고, 추론 호출이 전부 동기 블로킹이라 asyncio.to_thread로 스레드풀에 넘기는 전략을 쓰기 위해 async 프레임워크가 필요했습니다.",
      },
      {
        name: "Docker Compose",
        role: "배포·데이터 분리",
        reason: "공개 표준 문서는 이미지에 번들링하고, 민감한 TARA 데이터와 인덱스는 호스트 볼륨으로 분리했습니다. 데이터 유출 없이 이미지만 교체해 배포할 수 있는 구조를 의도했습니다.",
      },
    ],
    problemSolving: [
      {
        issue:
          "'M013-1 위협을 설명해줘'처럼 표준·위협 식별자를 묻는 질의에서 정작 해당 항목을 찾지 못하고 엉뚱한 결과가 나왔습니다.",
        analysis:
          "dense 임베딩은 'M013-1'처럼 의미가 없는 코드를 '자동차', '보안' 같은 일반 단어와 구분하지 못했습니다. reranker도 식별자를 서브워드로 쪼개버려서 오히려 정확 매칭을 방해했습니다.",
        solution:
          "dense 0.7 + sparse 0.3으로 점수를 결합해 정확 토큰 매칭을 보강하고, 입력에서 ID 패턴(M013-1, ISO 15.4 등)이 감지되면 reranker를 우회한 뒤 sparse 매칭을 부스트하도록 분기했습니다. '모든 질의를 같은 파이프라인으로 처리해야 한다'는 생각을 버린 게 핵심이었습니다.",
        result:
          "식별자 질의에서 해당 항목이 안정적으로 상위에 노출됐고, 일반 질의는 기존대로 reranker를 거쳐 관련도를 유지했습니다.",
      },
      {
        issue:
          "임베딩·FAISS·reranker·Ollama 호출이 모두 동기 블로킹이라 동시에 2개 이상 질의가 들어오면 뒤의 요청이 앞의 추론이 끝날 때까지 멈췄습니다.",
        analysis:
          "FastAPI는 async인데 추론 라이브러리들은 전부 동기여서, async 함수 안에서 직접 호출하면 이벤트 루프 자체가 블로킹됐습니다.",
        solution:
          "모든 블로킹 호출을 asyncio.to_thread로 스레드풀에 위임했고, RAG 쪽이 실패하더라도 tAIRA의 TARA 분석은 빈 컨텍스트로 계속 진행되도록 graceful degradation을 설계했습니다. RAG는 보조 도구이지 tAIRA의 핵심 흐름을 막으면 안 된다는 판단이었습니다.",
        result:
          "동시 질의에서 이벤트 루프 블로킹이 사라졌고, RAG 장애가 tAIRA 전체 분석을 중단시키지 않습니다.",
      },
    ],
    retrospective: {
      improvements:
        "임베딩부터 답변 생성까지 RAG 파이프라인 전체를 직접 설계하면서, '만능 파이프라인'보다 '질의 유형별 분기'가 더 실용적이라는 걸 배웠습니다.",
      regrets:
        "recall@k 같은 정량 평가 없이 '결과가 괜찮아 보이는지'로 튜닝한 점이 가장 아쉽습니다. 평가 기준이 없으니 개선인지 퇴보인지 확신할 수 없었습니다.",
      futureWork:
        "평가 하니스를 만들어 튜닝을 정량화하고, 인덱스 재빌드·배포를 GitOps로 자동화할 계획입니다.",
    },
    links: {},
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC 인프라",
    period: "2026.02 ~ 2026.03",
    overview: {
      description:
        "실제 서비스급 트래픽을 감당하는 쿠버네티스 플랫폼을 설계하고 싶어 시작한 프로젝트입니다. EKS 기반 애플리케이션 플랫폼과 Central VPC 중앙 관제 네트워크를 구축하고, QA 환경에서 2,000 RPS · 12만 요청으로 구조의 유효성을 직접 검증했습니다.",
      role: "팀장으로 전체 일정과 방향을 조율하면서 EKS 중심 아키텍처 설계를 주도했습니다. '부하가 걸렸을 때 어디서 먼저 터지는가'를 미리 예측하고 대응하는 것에 집중했습니다.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "Prod / QA / Dev / DR / Central VPC 5개 환경으로 나누고, Prod·QA는 CloudFront → ALB(Ingress) → EKS Pod 흐름을 멀티 AZ로 구성했습니다. 데이터 계층은 Aurora + RDS Proxy, Central VPC에 GitLab·모니터링·DNS 보안 관측을 모았습니다.",
      reasoning:
        "ECS도 검토했지만 KEDA·Karpenter 같은 오픈소스로 오토스케일링을 세밀하게 제어하고 싶었고, Helm 차트로 환경별 설정을 일관되게 관리하고 싶어서 EKS를 택했습니다. Central VPC는 처음에 없었는데, 환경마다 따로 모니터링을 붙이다 보니 알람이 흩어져서 전체 그림을 보기 어렵다는 문제를 느꼈고, 공통 서비스를 한 곳에 모아 관리하는 중앙 관제형으로 전환했습니다. DR은 Active-Active까지 갈 예산이 없어서, 평시에는 최소 리소스만 유지하고 장애 시 빠르게 확장하는 Pilot Light 전략으로 비용과 복구 시간의 균형을 맞췄습니다.",
    },
    techStack: [
      {
        name: "Terraform",
        role: "인프라 프로비저닝·DR 재현성",
        reason: "5개 환경을 콘솔에서 수동으로 맞추면 실수가 반복될 게 뻔했고, 특히 DR 환경은 평소에 안 쓰다가 장애 시 재현해야 하므로 코드로 정의하지 않으면 의미가 없다고 판단했습니다.",
      },
      {
        name: "AWS EKS",
        role: "애플리케이션 실행·오케스트레이션",
        reason: "ECS와 고민했지만, KEDA로 RPS 기반 스케일링을 하고 Karpenter로 노드까지 자동 확장하려면 쿠버네티스 생태계가 필요했습니다. '트래픽이 올라갈 때 Pod만이 아니라 노드까지 같이 늘어나는 구조'를 만들고 싶었습니다.",
      },
      {
        name: "KEDA",
        role: "요청량 기반 Pod 오토스케일링",
        reason: "HPA의 CPU 기반 스케일링은 실제 사용자 트래픽과 괴리가 컸습니다. Prometheus에서 수집한 Pod당 평균 RPS를 기준으로 확장해야 실제 부하에 맞게 반응할 수 있었고, 최소 45개 Pod 선기동으로 Cold Start 문제도 함께 해결했습니다.",
      },
      {
        name: "Karpenter",
        role: "노드 레벨 오토스케일링",
        reason: "KEDA가 Pod를 늘려도 노드가 부족하면 Pending이 발생합니다. Cluster Autoscaler는 반응이 느렸고, Karpenter는 Pending Pod를 감지해 필요한 사양의 노드를 빠르게 생성해줘서 Pod-노드 확장을 동시에 맞출 수 있었습니다.",
      },
      {
        name: "ArgoCD / GitOps",
        role: "선언형 배포 상태 관리",
        reason: "kubectl apply를 직접 치면 '지금 운영 환경이 Git과 같은 상태인지' 확신할 수 없었습니다. Git을 단일 소스로 삼아 배포 상태와 이력을 추적할 수 있어야 5개 환경을 관리할 수 있다고 판단했습니다.",
      },
      {
        name: "IRSA",
        role: "Pod 단위 AWS 권한 분리",
        reason: "노드에 IAM Role을 붙이면 그 노드 위의 모든 Pod가 같은 권한을 갖게 됩니다. Pod마다 필요한 권한만 ServiceAccount에 매핑해 보안 범위를 최소화하고 싶었습니다.",
      },
    ],
    problemSolving: [
      {
        issue:
          "부하 테스트 시 Spring Boot Pod가 부팅 완료 전에 트래픽을 받아 에러가 나고, HPA 기반 확장은 트래픽 증가를 따라가지 못해 응답 지연이 발생했습니다.",
        analysis:
          "Spring Boot는 부팅에 10~15초가 걸리는데 readiness probe 없이 바로 서비스에 등록됐고, HPA는 CPU 기준이라 실제 요청량 증가와 반응 시점이 달랐습니다. Pod는 늘어나도 노드가 부족해 Pending이 발생하는 문제도 겹쳤습니다.",
        solution:
          "startup/readiness/liveness probe를 분리해 부팅 완료 전 트래픽 유입을 차단하고, KEDA로 Pod당 평균 RPS 기준 스케일링으로 전환했습니다. 최소 45개 Pod를 선기동해 초반 부하를 흡수하고, Karpenter로 Pending 시 노드를 자동 확장해 Pod-노드 확장 타이밍을 맞췄습니다.",
        result:
          "QA에서 약 2,000 RPS를 60초간 유지하며 총 12만 요청을 무중단 처리했습니다.",
      },
      {
        issue:
          "워커 노드가 EKS API와 통신하지 못해 Join에 실패하거나 NotReady 상태로 빠졌습니다.",
        analysis:
          "처음에는 노드 자체의 문제인 줄 알았는데, 실제로는 Private Subnet의 라우팅 테이블이 NAT Gateway를 거치지 않아 컨트롤플레인에 도달하지 못한 네트워크 설정 오류였습니다.",
        solution:
          "서브넷 라우팅과 DNS 설정을 바로잡고, 인스턴스 타입별 MaxPods 한계도 함께 조정했습니다. 이 경험 이후 EKS 네트워크 체크리스트를 만들어 환경 추가 시 같은 실수를 반복하지 않도록 했습니다.",
        result:
          "노드 Join 문제가 해소되어 Karpenter 기반 오토스케일링이 안정적으로 동작했습니다.",
      },
    ],
    retrospective: {
      improvements:
        "'설계한 구조가 실제 부하에서 버티는가'를 직접 검증한 경험이 가장 컸습니다. 도면 위의 아키텍처와 실제 트래픽에서의 아키텍처는 다르다는 걸 체감했습니다.",
      regrets:
        "부하 테스트 전에 리소스 스펙을 충분히 시뮬레이션하지 못해 AWS 비용을 초과했고, Karpenter 설정을 GitOps 흐름에 완전히 통합하지 못한 채 프로젝트가 끝났습니다.",
      futureWork:
        "Karpenter까지 포함한 완전한 GitOps 자동화와, 부하 테스트 전 비용 시뮬레이션 프로세스를 갖추고 싶습니다.",
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
        "포트폴리오를 PDF로 보내달라는 요청을 받을 때마다 수동으로 만들기 귀찮아서, '웹으로 보여주고 PDF도 자동 생성되는 사이트'를 직접 만들기로 했습니다. 만드는 김에 프론트부터 인프라·CI/CD까지 전부 혼자 해보자는 목표로 시작했습니다.",
      role: "Next.js 프론트엔드, Puppeteer PDF 생성, 피드백 알림 시스템, Terraform IaC, GitHub Actions CI/CD까지 전 과정 단독 담당. '배포 버튼 한 번이면 끝'인 구조를 만드는 것이 개인적인 기준이었습니다.",
    },
    architecture: {
      diagram: "/images/real.png",
      description:
        "정적 페이지는 CloudFront(OAC) → S3로 서빙하고, PDF 생성과 피드백 제출은 API Gateway → Lambda로 처리합니다. 피드백은 EventBridge로 이메일 발송 Lambda와 느슨하게 연결했고, WAF·보안 헤더·X-Ray·CloudWatch 알람으로 보안과 관측을 확보했습니다.",
      reasoning:
        "EC2에 Next.js 서버를 올리는 게 가장 간단했지만, 포트폴리오 사이트는 트래픽이 거의 없어서 상시 서버 비용이 아까웠습니다. 정적 페이지는 S3+CloudFront로 비용을 거의 0에 가깝게 만들고, PDF 생성처럼 간헐적이지만 무거운 작업만 Lambda로 분리하는 구조를 택했습니다. 피드백 시스템은 처음에 수신 Lambda가 직접 이메일을 보내게 했는데, 나중에 Slack이나 DB 저장을 추가하고 싶을 때 Lambda를 수정해야 하는 게 싫어서 EventBridge로 분리했습니다. Rule만 추가하면 새 소비자를 붙일 수 있는 구조입니다.",
    },
    techStack: [
      {
        name: "Next.js 16 / React / TypeScript",
        role: "웹 페이지·PDF 렌더링 페이지 구현",
        reason: "Gatsby도 고려했지만 App Router의 정적 생성(SSG)이 S3 배포에 딱 맞았고, 데이터 타입을 TypeScript로 잡으면 프로젝트 데이터 구조가 바뀔 때 컴파일 단계에서 잡을 수 있어 선택했습니다.",
      },
      {
        name: "AWS S3 + CloudFront + OAC",
        role: "정적 파일 저장·글로벌 CDN",
        reason: "S3를 퍼블릭으로 여는 건 보안상 꺼려져서, OAC로 CloudFront를 통해서만 접근하도록 제한했습니다. 포트폴리오에 글로벌 CDN까지 필요할까 싶지만, CloudFront의 캐싱과 HTTPS 처리가 편해서 함께 적용했습니다.",
      },
      {
        name: "AWS Lambda + Puppeteer (컨테이너)",
        role: "서버리스 PDF 생성",
        reason: "Puppeteer의 Chromium 바이너리가 250MB 이상이라 ZIP 패키징 Lambda의 크기 제한(50MB)을 넘겼습니다. 컨테이너 이미지 Lambda로 전환하니 크기 제한 문제가 사라지고, PDF 요청이 하루 몇 건 정도라 서버를 띄우는 것보다 비용이 훨씬 낮았습니다.",
      },
      {
        name: "AWS API Gateway",
        role: "Lambda 호출 HTTP 엔드포인트",
        reason: "Lambda를 직접 URL로 노출할 수도 있지만, 나중에 인증이나 요청 제한을 추가할 때 API Gateway가 있어야 유연합니다. X-Ray 추적도 여기서 켜면 바로 되는 점이 좋았습니다.",
      },
      {
        name: "Amazon EventBridge + SES",
        role: "피드백 이벤트 처리·이메일 알림",
        reason: "피드백 수신 Lambda가 직접 이메일을 보내면 간단하지만, Slack 알림이나 DB 저장을 나중에 추가하려면 그때마다 Lambda 코드를 수정해야 합니다. EventBridge로 이벤트를 발행하면 소비자를 Rule로만 추가할 수 있어 확장이 자유로워집니다.",
      },
      {
        name: "Terraform",
        role: "전체 인프라 IaC",
        reason: "CloudFront·S3·WAF·Lambda 등 리소스가 10개가 넘으니 콘솔에서 수동으로 관리하면 '이거 왜 이렇게 설정돼 있지?'가 반복될 게 뻔했습니다. 코드로 정의하면 설정 의도가 히스토리에 남고, 환경을 통째로 재현할 수 있습니다.",
      },
      {
        name: "GitHub Actions",
        role: "프론트·Lambda 배포 자동화",
        reason: "매번 빌드 → S3 업로드 → 캐시 무효화를 수동으로 하다 보면 빠트리는 단계가 생겼습니다. push 한 번이면 전체가 돌아가도록 자동화하니 배포 실수가 완전히 사라졌습니다.",
      },
    ],
    problemSolving: [
      {
        issue: "Lambda에서 Puppeteer로 PDF를 생성했더니 한글이 전부 □□□로 깨져 나왔습니다.",
        analysis:
          "Chromium은 시스템에 설치된 폰트를 쓰는데, Lambda 컨테이너 환경에는 한글 폰트가 아예 없었습니다. 로컬에서는 잘 되다가 Lambda에서만 깨지니 처음엔 인코딩 문제인 줄 알았지만, 폰트 부재가 원인이었습니다.",
        solution:
          "컨테이너 이미지에 Noto Sans KR을 번들링하고, print 페이지에서 document.fonts.ready를 기다린 뒤에 PDF를 캡처하도록 waitForFunction을 추가했습니다. 외부 CDN에 의존하면 네트워크 상태에 따라 또 깨질 수 있어서 이미지 내에 포함시키는 걸 선택했습니다.",
        result:
          "한글이 일관되게 렌더링되고, 외부 네트워크 의존 없이 어떤 환경에서든 같은 결과를 보장합니다.",
      },
      {
        issue: "배포 후 프로젝트 상세 페이지에서 뒤로가기나 홈 버튼을 누르면 홈이 아니라 프로젝트 페이지로 다시 돌아갔습니다.",
        analysis:
          "모든 정적 파일에 immutable 캐시를 건 게 문제였습니다. Next.js의 RSC 페이로드(.rsc)까지 장기 캐시가 적용돼서, 브라우저가 오래된 라우팅 데이터를 계속 참조하고 있었습니다. '정적 파일은 다 오래 캐시해도 된다'는 단순한 생각이 원인이었습니다.",
        solution:
          "S3 업로드 단계에서 파일 유형별로 Cache-Control을 분리했습니다. HTML과 RSC 페이로드는 no-cache로, 콘텐츠 해시가 붙은 JS·CSS만 immutable로 적용했습니다.",
        result:
          "라우팅 문제가 해결됐고, 해시가 붙은 에셋의 캐시 효율은 그대로 유지됩니다.",
      },
    ],
    retrospective: {
      improvements:
        "프론트엔드부터 서버리스 백엔드, IaC, CI/CD까지 혼자 처음부터 끝까지 구축한 경험이 가장 컸습니다. 특히 '동작하는 것'과 '운영할 수 있는 것'의 차이를 WAF·X-Ray·CloudWatch 알람을 붙이면서 실감했습니다.",
      regrets:
        "PDF 첫 요청 시 Lambda Cold Start가 10초 가까이 걸리는데 아직 해결하지 못했고, Terraform 모듈이 커지면서 구조가 복잡해져 리팩터링이 필요합니다.",
      futureWork:
        "Provisioned Concurrency로 Cold Start를 줄이고, 피드백 시스템에 Slack 알림과 DB 저장을 EventBridge Rule로 추가할 계획입니다.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
      velog: "https://velog.io/@eomkyeongmun/series/project",
    },
  },
];
