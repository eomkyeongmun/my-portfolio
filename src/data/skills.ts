export interface Skill {
  name: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  items: Skill[];
}

export const skills: SkillCategory[] = [
  {
    category: "Backend",
    items: [
      {
        name: "기술명 (예: Node.js, Spring Boot)",
        description: "이 기술로 무엇을 했는지 한 줄 설명 (예: 10만 트래픽 처리를 위한 비동기 서버 구축)",
      },
    ],
  },
  {
    category: "Infrastructure",
    items: [
      {
        name: "기술명 (예: AWS ECS, Terraform)",
        description: "이 기술로 무엇을 했는지 한 줄 설명 (예: IaC 기반의 재사용 가능한 컨테이너 인프라 프로비저닝)",
      },
    ],
  },
  {
    category: "DevOps/Tools",
    items: [
      {
        name: "기술명 (예: GitHub Actions, Docker)",
        description: "이 기술로 무엇을 했는지 한 줄 설명 (예: 무중단 배포 파이프라인 구축으로 배포 시간 50% 단축)",
      },
    ],
  },
  {
    category: "Monitoring",
    items: [
      {
        name: "기술명 (예: Prometheus, Grafana)",
        description: "이 기술로 무엇을 했는지 한 줄 설명 (예: 핵심 메트릭 대시보드 구축 및 비정상 지표 슬랙 알림 연동)",
      },
    ],
  },
];
