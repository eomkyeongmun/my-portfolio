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
    problem: "CPU 기반 HPA는 실제 요청량 변화를 즉시 반영하지 못했고, 미준비 Pod로 트래픽이 유입되거나 노드 확보 지연으로 Pending이 반복됐다.",
    action: "Probe 분리·ALB 헬스체크 통일로 미준비 Pod 차단, KEDA로 RPS 기반 Pod 확장, 45개 선기동으로 초기 수용량 확보, Karpenter로 노드 자동 추가.",
    result: "QA에서 2,000 RPS 60초 안정 유지, 120,000건 처리 검증. 다층 오토스케일링 구조 완성.",
  },
  {
    title: "분산 NAT → Central VPC · TGW 중앙화",
    category: "비용최적화",
    problem: "환경마다 NAT Gateway를 독립 운영해 고정 비용이 중복됐고, 보안·로그 관측 지점이 여러 VPC에 분산돼 운영 복잡도가 높았다.",
    action: "Central VPC 중심으로 egress 재설계, TGW로 각 VPC 연결. GitLab·모니터링 등 공통 서비스를 Central VPC에 집중 배치.",
    result: "Dev·QA·Prod·DR 4환경 NAT를 Central VPC 1개로 통합해 고정 비용 절감. 외부 통신·보안 이벤트 단일 관측 지점 확보.",
  },
  {
    title: "멀티스테이지 Docker 빌드로 이미지 경량화",
    category: "CICD",
    problem: "단일 이미지에 JDK·Gradle·소스코드까지 포함돼 이미지가 크고, CI/CD 빌드·푸시 시간과 ECR 저장 부담이 불필요하게 늘었다.",
    action: "빌드 단계(Gradle JAR 생성)와 실행 단계(JRE 경량 이미지)를 분리해 Dockerfile 재구성. 런타임에는 최종 산출물만 포함.",
    result: "빌드 단계 제거로 이미지 크기 대폭 감소, ECR 푸시 시간 단축. 런타임 최소 구성으로 배포 안정성·비용 동시 개선.",
  },
];
