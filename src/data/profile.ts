export interface Education {
  school: string;
  major: string;
  gpa: string;
  majorGpa: string;
}

export interface Bootcamp {
  name: string;
  organizer: string;
  period: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Profile {
  name: string;
  title: string;
  summary: string;
  education: Education;
  bootcamp?: Bootcamp[];
  experience?: Experience[];
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
  education: {
    school: "동국대학교",
    major: "정보통신공학과",
    gpa: "4.08 / 4.5",
    majorGpa: "4.25",
  },
  title: "AI는 시스템을 만들 수 있지만, 인프라는 사람이 지켜냅니다",
  summary:
    "서비스가 안정적으로 운영될 수 있도록 인프라를 설계하고 자동화하는 엔지니어를 목표로 하고 있습니다. 클라우드, 컨테이너, 배포 자동화, 시스템 구조 설계에 관심이 많으며, 단순 개발을 넘어 확장성과 운영 효율까지 고려하는 아키텍처를 만들고 싶습니다. 부트캠프와 인턴 경험을 통해 클라우드 및 AI 기반 서비스 개발 경험을 쌓고 있습니다.",
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
      description: ["AI 기반 TARA 자동화 툴 개발", "자동차공학회 논문 작성"],
    },
  ],
  keywords: ["AWS / Cloud", "Docker / DevOps", "Infra Architecture"],
  links: {
    email: "eomkyeongmun@naver.com",
    github: "https://github.com/eomkyeongmun",
    blog: "https://velog.io/@eomkyeongmun/posts",
  },
};