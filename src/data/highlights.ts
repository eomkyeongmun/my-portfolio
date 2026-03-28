export type HighlightCategory =
  | "장애대응"
  | "CICD"
  | "모니터링"
  | "비용최적화"
  | "트래픽"
  | "성능개선"
  | "기타";

export interface Highlight {
  title: string;
  category: HighlightCategory;
  problem: string;
  action: string;
  result: string;
}

export const highlights: Highlight[] = [
  {
    title: "EKS 다층 오토스케일링으로 2,000 RPS 대응",
    category: "트래픽",
    problem: "CPU 기반 HPA는 요청 급증 반영이 늦어 미준비 Pod 유입과 Pending이 반복됐습니다.",
    action: "Probe 분리와 ALB 헬스체크 통일로 미준비 Pod를 차단하고, KEDA·선기동·Karpenter로 확장 구조를 보완했습니다.",
    result: "QA에서 2,000 RPS를 60초간 안정적으로 유지했고, 총 120,000건 처리로 다층 오토스케일링 구조를 검증했습니다.",
  },
  {
    title: "분산 NAT → Central VPC · TGW 중앙화",
    category: "비용최적화",
    problem: "환경별 NAT Gateway를 각각 운영해 고정 비용이 중복됐고, 보안·로그 관측 지점이 분산돼 운영 부담이 커졌습니다.",
    action: "Central VPC 중심으로 egress 경로를 재설계하고 TGW로 각 VPC를 연결해 공통 서비스와 관제 지점을 중앙화했습니다.",
    result: "Dev·QA·Prod·DR 4개 환경의 NAT를 Central VPC 1개로 통합해 고정 비용을 절감하고 단일 관제 체계를 확보했습니다.",
  },
  {
    title: "멀티스테이지 Docker 빌드로 이미지 경량화",
    category: "CICD",
    problem: "단일 이미지에 JDK·Gradle·소스코드까지 포함돼 이미지가 비대했고, CI/CD 시간과 ECR 비용이 함께 증가했습니다.",
    action: "빌드 단계와 실행 단계를 분리한 멀티스테이지 Dockerfile로 재구성하고, 런타임에는 최종 JAR만 포함하도록 최적화했습니다.",
    result: "이미지 크기를 줄여 ECR 푸시 시간을 단축했고, 배포 안정성과 저장 비용 효율을 함께 개선했습니다.",
  },
];
