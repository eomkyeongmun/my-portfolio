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
    gpa: "4.08 / 4.5",
    majorGpa: "4.25",
  },
  title: "AI 기술을 실제 인프라와 서비스로 연결하는 사람이 되겠습니다",
  summary:
    "서비스가 안정적으로 운영될 수 있도록 인프라를 설계하고 자동화하는 엔지니어를 목표로 하고 있습니다. 클라우드, 컨테이너, 배포 자동화, 시스템 구조 설계에 관심이 많으며 단순 개발을 넘어 확장성과 운영 효율까지 고려하는 아키텍처를 만들고 싶습니다.",
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
      period: "2026.03 - 2026.06",
      description: [
        "LLM·RAG 기반 자동차 사이버보안 Q&A 자동화 툴 개발",
        "SDV OTA 보안 관련 자동차공학회 논문 작성",
      ],
      paper: {
        title:
          "SDV OTA 웨이브 전환에서의 레이스 컨디션과 계층적 안전 전환 프로토콜",
        summary:
          "Kubernetes + Istio 기반 OTA 백엔드(auth→campaign→package→deploy)의 웨이브 전환 구간에서 발생하는 레이스 컨디션과 보안 홀을 정량화하고, 이를 차단하는 계층적 안전 전환 프로토콜(HSTP)을 설계·검증했습니다. 비활성화 순서만으로 보안 홀이 약 52초에서 0초로 갈렸고, HSTP + 마이크로세그멘테이션 적용 시 Lateral Movement 차단율 99.1%, 요청 성공률 85.6%를 달성했습니다.",
        keywords: ["SDV / OTA", "Kubernetes", "Istio", "Zero Trust", "mTLS"],
        pdf: "/images/sdv_ota_paper.pdf",
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
  keywords: ["AWS / Cloud", "Docker / DevOps", "Infra Architecture"],
  links: {
    email: "eomkyeongmun@naver.com",
    phone: "010-4716-6629",
    github: "https://github.com/eomkyeongmun",
    blog: "https://velog.io/@eomkyeongmun/posts",
  },
};