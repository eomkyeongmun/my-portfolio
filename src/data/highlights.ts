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
    title: "EKS 다층 오토스케일링으로 1,700 RPS 대응",
    category: "트래픽",
    problem: "이 워크로드는 대부분이 I/O 대기라 CPU에 부하 신호가 잡히지 않고, 미준비 Pod로 트래픽이 들어가 에러가 났습니다.",
    action: "확장 기준을 Pod당 요청 수로 바꾸자고 팀을 설득하고, probe 분리와 ALB 헬스체크 경로 통일로 미준비 Pod를 차단했습니다. 45 Pod 선기동을 1차 방어, KEDA·Karpenter를 2차 방어로 배치했습니다.",
    result: "QA에서 1,700 RPS를 60초간 안정적으로 유지했고, 총 100,000건 처리로 다층 오토스케일링 구조를 검증했습니다.",
  },
  {
    title: "분산 NAT → Central VPC · TGW 중앙화",
    category: "비용최적화",
    problem: "환경마다 NAT Gateway와 모니터링 스택을 따로 두면 고정 비용이 중복되고, 관제 시스템이 서비스 VPC와 함께 죽으면 원인 분석 자체가 불가능해집니다.",
    action: "Central VPC 중심으로 egress 경로를 재설계하고 Transit Gateway 허브-스포크로 각 VPC를 연결했습니다. VPC Peering의 N:N 복잡도를 피하면서 공통 서비스와 관제 지점을 서비스 환경 밖에 두는 구조입니다.",
    result: "환경별로 흩어져 있던 NAT와 관제를 Central VPC 하나로 모아, 관제 가용성을 서비스 가용성과 분리하고 NAT 고정 비용 중복도 없앴습니다.",
  },
  {
    title: "식별자 질의 실패를 평가셋으로 특정해 개선",
    category: "성능개선",
    problem: "RAG 검색이 전체적으로는 괜찮은데 특정 질문에서만 반복해서 빗나갔고, 어느 유형인지 감으로는 알 수 없었습니다.",
    action: "실제 업무 질문 31문항으로 평가셋을 만들고 k를 스윕해 유형별로 갈라보니, 위협 ID·조항번호 질의에서만 정답이 밀려 있었습니다. 해당 패턴은 재정렬을 우회하고 정확 매칭을 강제하도록 분기했습니다.",
    result: "정답을 1위로 찾아낸 질의가 18건에서 21건으로, MRR은 0.703에서 0.785로 올랐습니다.",
  },
];
