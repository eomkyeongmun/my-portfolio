import type { SkillCategory } from "@/data/skills";

export const skills: SkillCategory[] = [
  {
    category: "Backend",
    items: [
      {
        name: "Spring Boot",
        description:
          "REST API design and implementation with Spring Security, OAuth2, JWT-based auth, and layered architecture",
        level: 2,
      },
      {
        name: "Java",
        description:
          "OOP-based dependency injection and interface segregation to minimize module coupling",
        level: 2,
      },
      {
        name: "Python / FastAPI",
        description: "Lightweight async REST API server implementation",
        level: 2,
      },
      {
        name: "JPA / MySQL",
        description:
          "Relational mapping with N+1 analysis and Fetch Join for query optimization",
        level: 2,
      },
    ],
  },
  {
    category: "Infra / Platform",
    items: [
      {
        name: "AWS EKS",
        description:
          "Validated 2,000 RPS / 120K requests with zero downtime using KEDA + Karpenter autoscaling",
        level: 3,
      },
      {
        name: "Terraform",
        description:
          "Full infrastructure-as-code across all environments, ensuring reproducibility and DR readiness",
        level: 2,
      },
      {
        name: "AWS (CloudFront · S3)",
        description:
          "CDN caching and serverless static asset serving to minimize origin load and improve global latency",
        level: 2,
      },
      {
        name: "AWS (ALB)",
        description:
          "Path/host-based routing with listener rules for per-service traffic distribution and health checks",
        level: 2,
      },
      {
        name: "Docker / ECR",
        description:
          "Standardized container images and ECR-based version management for consistent deployments",
        level: 3,
      },
    ],
  },
  {
    category: "CI/CD & GitOps",
    items: [
      {
        name: "GitHub Actions",
        description:
          "Full pipeline automation covering build, test, and deploy — eliminating manual deployments",
        level: 2,
      },
      {
        name: "Argo CD",
        description:
          "Declarative GitOps deployments with Git as the single source of truth for operational state",
        level: 2,
      },
    ],
  },
  {
    category: "Observability",
    items: [
      {
        name: "Prometheus / Grafana",
        description:
          "Metrics collection and visualization dashboards; used as KEDA scaling decision inputs",
        level: 2,
      },
      {
        name: "CloudWatch",
        description:
          "Log metric filters, alarms, SNS, and Lambda chain for automated DNS security event detection",
        level: 2,
      },
      {
        name: "OpenTelemetry / X-Ray",
        description:
          "Distributed tracing for inter-service latency bottleneck analysis and request flow visibility",
        level: 2,
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        name: "IRSA",
        description:
          "Per-ServiceAccount IAM permission isolation enforcing the principle of least privilege",
        level: 3,
      },
      {
        name: "AWS WAF",
        description:
          "L7 security policy in front of CloudFront to defend against common web attacks",
        level: 2,
      },
      {
        name: "Secrets Manager",
        description:
          "Centralized secret management to eliminate hardcoded credentials in code and env vars",
        level: 2,
      },
    ],
  },
];
