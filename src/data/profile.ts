export interface Education {
  school: string;
  major: string;
  period?: string;
  gpa: string;
  majorGpa: string;
}

export interface Bootcamp {
  name: string;
  organizer: string;
  period: string;
}

export interface ExperiencePaper {
  title: string;        // 논문 제목
  summary: string;      // 핵심 내용 요약
  keywords?: string[];  // 핵심 키워드
  venue?: string;       // 학회/게재처
  pdf?: string;         // 논문 PDF 경로 (public/ 기준, 예: "/images/sdv_ota_paper.pdf")
  github?: string;      // GitHub 저장소 URL
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  paper?: ExperiencePaper;
}

export interface Club {
  name: string;
  period: string;
}

export interface MilitaryService {
  branch: string;   // 병과/군종 (예: "육군 병장")
  period: string;   // 복무 기간
  status: "completed" | "exempted" | "in_progress";
}

export interface Profile {
  name: string;
  birthdate?: string;
  title: string;
  summary: string;
  education: Education;
  bootcamp?: Bootcamp[];
  experience?: Experience[];
  clubs?: Club[];
  militaryService?: MilitaryService;
  keywords: string[];
  links: {
    email?: string;
    github?: string;
    blog?: string;
    [key: string]: string | undefined;
  };
}

export const profile: Profile = {
  name: "엄경문",
  birthdate: "2002.03.21",
  education: {
    school: "동국대학교",
    major: "정보통신공학과",
    period: "2021.03 - 2027.02",
    gpa: "4.06 / 4.5",
    majorGpa: "4.20",
  },
  title: "사용자의 다음 행동을 설계하는 백엔드 엔지니어가 되겠습니다",
  summary:
    "Spring Boot 기반 백엔드 시스템을 설계·구현하며, 사용자 행동 데이터를 바탕으로 서비스를 개선하는 엔지니어를 목표로 하고 있습니다. AI/LLM 기반 생산성 향상에 관심이 많으며, 확장 가능한 아키텍처와 데이터 기반 의사결정으로 프로덕트 가치를 높이고 싶습니다.",
  bootcamp: [
    {
      name: "Cloud Wave 7기",
      organizer: "CJ OliveNetworks",
      period: "2025.12 - 2026.02",
    },
  ],
  experience: [
    {
      company: "Rock Korea (Intern)",
      role: "",
      period: "2026.03 - 2026.08",
      description: [
        "LLM·RAG 기반 자동차 사이버보안 Q&A 자동화 툴 개발",
        "GitHub Actions CI/CD 파이프라인에 AI 에러 분석 연동 — 빌드·테스트 실패 시 로그를 LLM으로 요약·원인 분석해 Slack으로 즉시 알림 및 해결 가이드 제공",
        "SDV OTA 보안 관련 자동차공학회 논문 작성",
      ],
      paper: {
        title:
          "SDV OTA 웨이브 전환에서의 레이스 컨디션과 계층적 안전 전환 프로토콜",
        summary:
          "Kubernetes + Istio 기반 OTA 백엔드(auth→campaign→package→deploy)의 웨이브 전환 구간에서 발생하는 레이스 컨디션과 보안 홀을 정량화하고, 이를 차단하는 계층적 안전 전환 프로토콜(HSTP)을 설계·검증했습니다. 비활성화 순서만으로 보안 홀이 약 52초에서 0초로 갈렸고, HSTP + 마이크로세그멘테이션 적용 시 Lateral Movement 차단율 99.1%, 요청 성공률 85.6%를 달성했습니다.",
        keywords: ["SDV / OTA", "Kubernetes", "Istio", "Zero Trust", "mTLS"],
        pdf: "/images/sdv_ota_paper.pdf",
        github: "https://github.com/eomkyeongmun/sdv-ota-wave-research",
      },
    },
  ],
  clubs: [
    { name: "FC TOTO (축구중앙동아리)", period: "2022.03 - 2025.08" },
    { name: "링커스 (직무탐색동아리)", period: "2024.09 - 2024.12" },
    { name: "TAVE (개발 동아리)", period: "2025.03 - 2025.07" },
    { name: "FC 정통 (축구소모임 주장)", period: "2025.03 - 2026.02" },
  ],
  militaryService: {
    branch: "육군 병장",
    period: "2022.05.30 - 2023.11.29",
    status: "completed",
  },
  keywords: ["Spring Boot / Backend", "AI · LLM"],
  links: {
    email: "eomkyeongmun@naver.com",
    phone: "010-4716-6629",
    github: "https://github.com/eomkyeongmun",
    blog: "https://velog.io/@eomkyeongmun/posts",
  },
};