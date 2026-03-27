export interface Profile {
  name: string;
  title: string;
  summary: string;
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
  title: "AI는 시스템을 만들 수 있지만, 인프라는 사람이 지켜냅니다",
  summary: "서비스가 안정적으로 운영될 수 있도록 인프라를 설계하고 자동화하는 엔지니어를 목표로 하고 있습니다. 클라우드, 컨테이너, 배포 자동화, 시스템 구조 설계에 관심이 많으며, 단순 개발을 넘어 확장성과 운영 효율까지 고려하는 아키텍처를 만들고 싶습니다.",
  keywords: ["AWS / Cloud", "Docker / DevOps", "Infra Architecture"],
  links: {
    email: "eomkyeongmun@naver.com",
    github: "https://github.com/eomkyeongmun",
    blog: "https://velog.io/@eomkyeongmun/posts",
  },
};
