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
  category: "backend" | "infrastructure";
  title: string;
  period: string; // 예: "2023.01 ~ 2023.06"
  overview: {
    description: string;
    role: string;
  };
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
    title: "백엔드 프로젝트 이름",
    period: "YYYY.MM ~ YYYY.MM",
    overview: {
      description: "서비스 또는 시스템에 대한 1~2줄 요약 설명",
      role: "팀 내에서 내가 주로 담당한 역할",
    },
    architecture: {
      diagram: "/images/projects/backend-architecture.png",
      description: "서비스의 전체적인 구성도 설명",
      reasoning: "이러한 아키텍처 구조를 설계하고 채택한 명확한 이유 (예: 단기간에 몰리는 트래픽을 비동기로 처리하기 위해 MQ 채택)", // 모든 선택에는 이유가 있어야 한다
    },
    techStack: [
      {
        name: "기술명 (예: Redis)",
        role: "프로젝트 내에서의 역할 (예: 세션 클러스터링 및 랭킹 데이터 캐싱)",
        reason: "이 기술을 선택한 이유 (예: RDBMS로 인한 I/O 병목을 해결하고 데이터 응답 속도를 높이기 위함)", // 모든 선택에는 이유가 있어야 한다
      },
    ],
    problemSolving: [
      {
        issue: "겪은 이슈 (예: 선착순 이벤트 시 동시성 이슈로 인한 재고 초과 차감)",
        analysis: "분석 과정 (예: 애플리케이션 로그 및 메트릭 확인 결과 DB 락 경합 및 스레드 풀 고갈 확인)",
        solution: "해결 방법 및 선택 이유 (예: Redis 분산 락, DB 비관적 락 등의 대안 중 X를 선택. 그 이유는 Y이기 때문)", // 모든 선택에는 이유가 있어야 한다
        result: "결과 (예: 동시 요청 1만 건에서도 데이터 무결성 보장 및 응답속도 Z% 향상 달성)",
      },
    ],
    retrospective: {
      improvements: "프로젝트를 통해 성능, 안정성, 비즈니스 측면에서 개선된 부분",
      regrets: "오버엔지니어링이었거나, 시간 관계상 임시 방편으로 처리한 아쉬운 부분",
      futureWork: "이 시스템의 규모가 10배 커진다면 추가로 고려해야 할 설계 요소",
    },
    links: {
      github: "https://github.com/...",
      demo: "https://...",
      blog: "https://...",
    },
  },
  {
    category: "infrastructure",
    title: "인프라 구축 프로젝트 이름",
    period: "YYYY.MM ~ YYYY.MM",
    overview: {
      description: "어떤 목적의 인프라 시스템인지 요약 설명",
      role: "내 역할 (예: 인프라 프로비저닝 및 CI/CD 파이프라인 구축)",
    },
    architecture: {
      diagram: "/images/projects/infra-architecture.png",
      description: "인프라 토폴로지, 네트워크, 보안 정책 등 구성 설명",
      reasoning: "이러한 아키텍처로 설계한 이유 (예: 단일 장애점(SPOF)을 제거하고 고가용성을 확보하기 위한 Multi-AZ 구성 채택)", // 모든 선택에는 이유가 있어야 한다
    },
    techStack: [
      {
        name: "기술명 (예: Terraform)",
        role: "역할 (예: 클라우드 리소스 생성 및 상태 관리)",
        reason: "이 기술을 선택한 이유 (예: UI 클리닝 방식의 휴먼 에러를 방지하고 인프라 버전을 체계적으로 관리하기 위해)", // 모든 선택에는 이유가 있어야 한다
      },
    ],
    problemSolving: [
      {
        issue: "겪은 이슈 (예: 컨테이너 롤링 배포 도중 간헐적인 다운타임 발생 및 요청 실패)",
        analysis: "분석 과정 (예: 로드밸런서의 상태 검사 주기와 새 컨테이너의 웜업 시간 차이로 인해 덜 준비된 컨테이너에 트래픽이 인입됨을 확인)",
        solution: "해결 방법 및 선택 이유 (예: 앱 내 Graceful Shutdown 적용 및 대상 그룹 헬스체크 설정을 X로 변경한 이유)", // 모든 선택에는 이유가 있어야 한다
        result: "결과 (예: 무중단 배포 100% 달성 및 배포 중 5xx 에러율 0% 기록)",
      },
    ],
    retrospective: {
      improvements: "자동화, 보안 강화, 비용 절감 등 인프라 측면에서 달성한 가치",
      regrets: "프로비저닝을 자동화하지 못한 일부 수동 영역 등 아쉬운 점",
      futureWork: "추후 보안성 향상이나 스케일 아웃을 위해 도입을 고려하는 도구",
    },
    links: {
      github: "https://github.com/...",
    },
  },
];
