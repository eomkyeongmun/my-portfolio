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
  name: "이름 입력", // 예: 홍길동
  title: "한 줄 키워드 소개 입력", // 예: 문제 해결을 즐기는 백엔드/인프라 엔지니어
  summary: "어떤 엔지니어인지, 목표 2~3문장 두괄식 입력", // 예: 트래픽 최적화와 안정적인 인프라 설계에 관심이 많은 백엔드 엔지니어입니다. 문제의 근본 원인을 찾고 시스템을 개선하는 과정을 즐깁니다.
  keywords: ["키워드1", "키워드2", "키워드3"], // 예: ["Backend", "AWS", "트러블슈팅"]
  links: {
    email: "이메일 주소 입력",
    github: "깃허브 URL 입력",
    blog: "기술 블로그 URL 입력",
  },
};
