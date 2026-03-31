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
    title: "Multi-Layer EKS Autoscaling for 2,000 RPS",
    category: "Traffic",
    problem:
      "CPU-based HPA was too slow to reflect traffic spikes, causing unready Pods to receive requests and repeated Pending states.",
    action:
      "Separated startup/readiness/liveness probes and aligned ALB health check paths to block unready Pods. Supplemented with KEDA pre-scaling and Karpenter for a multi-layer autoscaling architecture.",
    result:
      "Sustained 2,000 RPS for 60 seconds and handled 120,000 total requests in QA — validating the multi-layer autoscaling design.",
  },
  {
    title: "Centralized NAT via Central VPC & Transit Gateway",
    category: "Cost Optimization",
    problem:
      "Per-environment NAT Gateways duplicated fixed costs, while distributed security and observability points increased operational overhead.",
    action:
      "Redesigned egress routing around a Central VPC and connected each VPC via Transit Gateway to centralize shared services and observability.",
    result:
      "Consolidated NAT Gateways across Dev, QA, and Prod into a single Central VPC — reducing fixed costs and establishing a unified observability layer.",
  },
  {
    title: "Multi-Stage Docker Build for Leaner Images",
    category: "CI/CD",
    problem:
      "Single-stage images bundled JDK, Gradle, and source code together, bloating image size and increasing both CI/CD time and ECR costs.",
    action:
      "Restructured the Dockerfile into separate build and runtime stages, ensuring only the final JAR is included in the runtime image.",
    result:
      "Reduced image size, shortened ECR push time, and improved both deployment reliability and storage cost efficiency.",
  },
];
