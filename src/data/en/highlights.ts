export type HighlightCategoryEn =
  | "Incident Response"
  | "CI/CD"
  | "Monitoring"
  | "Cost Optimization"
  | "Traffic"
  | "Performance"
  | "Other";

export interface HighlightEn {
  title: string;
  category: HighlightCategoryEn;
  problem: string;
  action: string;
  result: string;
}

export const highlights: HighlightEn[] = [
  {
    title: "Multi-Layer EKS Autoscaling for 1,700 RPS",
    category: "Traffic",
    problem:
      "This workload is mostly I/O wait, so CPU never registers the load signal — and unready Pods were receiving traffic and erroring out.",
    action:
      "Argued the team into changing the scaling signal to per-Pod request count, and separated startup/readiness/liveness probes while aligning the ALB health check path to block unready Pods. 45 pre-provisioned Pods act as the first line of defense, with KEDA and Karpenter as the second.",
    result:
      "Sustained 1,700 RPS for 60 seconds and handled 100,000 total requests in QA — validating the multi-layer autoscaling design.",
  },
  {
    title: "Centralized NAT via Central VPC & Transit Gateway",
    category: "Cost Optimization",
    problem:
      "Giving every environment its own NAT Gateway and monitoring stack duplicates fixed cost — and if the observability system lives inside a service VPC, it dies with that VPC exactly when you need it to diagnose the outage.",
    action:
      "Redesigned egress routing around a Central VPC and connected each VPC through a Transit Gateway hub-and-spoke, avoiding the N:N complexity of VPC peering while placing shared services and observability outside the service environments.",
    result:
      "Consolidated the scattered NAT and observability points into a single Central VPC — decoupling observability availability from service availability and removing duplicated NAT fixed costs.",
  },
  {
    title: "Pinpointing Identifier-Query Failures with an Evaluation Set",
    category: "Performance",
    problem:
      "RAG retrieval looked fine overall but kept missing on a specific class of question, with no way to identify which class by intuition.",
    action:
      "Built a 31-question evaluation set from real analyst questions and swept k to split scores by category, which isolated the failures to threat-ID and clause-number queries. Those patterns now bypass reranking and force exact matching.",
    result:
      "Queries answered correctly at rank 1 rose from 18 to 21, and MRR from 0.703 to 0.785.",
  },
];
