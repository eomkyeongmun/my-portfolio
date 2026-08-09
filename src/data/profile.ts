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
  title: "서비스를 만들고, 인프라까지 책임지는 클라우드 네이티브 엔지니어",
  summary:
    "Spring Boot 백엔드 개발부터 Terraform 기반 클라우드 인프라 설계·운영까지 End-to-End로 서비스를 구축합니다. Cloud Wave 7기와 실무 경험을 통해 AWS 아키텍처, CI/CD 파이프라인, 컨테이너 오케스트레이션을 익혔으며, AI/LLM을 활용한 운영 자동화에 관심이 많습니다.",
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
  keywords: ["Cloud / Infra", "Backend", "AI · LLM"],
  links: {
    email: "eomkyeongmun@naver.com",
    phone: "010-4716-6629",
    github: "https://github.com/eomkyeongmun",
    blog: "https://velog.io/@eomkyeongmun/posts",
  },
};