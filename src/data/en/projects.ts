import type { Project } from "@/data/projects";

export const projects: Project[] = [
  {
    category: "backend",
    title: "Newgnal Backend",
    period: "May 2025 – Jul 2025",
    thumbnail: "/images/tave_signal.png",
    overview: {
      description:
        "Backend development for a community platform supporting user content and interaction features.",
      role: "Designed and implemented REST APIs for posts, nested comments, likes, and reports. Integrated OAuth2, JWT, and Spring Security for authentication and authorization. Added Redis as a caching layer and standardized the team development environment with Docker Compose.",
    },
    architecture: {
      diagram: "/images/backend_arc.png",
      description:
        "The Spring Boot backend processes requests from a React Native mobile app. The architecture consists of OAuth2 + JWT + Spring Security-based authentication, Redis/MySQL data handling, a news crawling scheduler, and an analysis service integration layer.",
      reasoning:
        "Consolidated authentication, API, and scheduling into Spring Boot to maximize developer productivity and maintainability. Separated Redis and MySQL to handle fast access and persistent storage independently. Decoupled crawling and analysis functions for extensibility and clear separation of concerns. Used Docker Compose to standardize the runtime environment and ensure deployment reproducibility.",
    },
    techStack: [
      {
        name: "Spring Boot",
        role: "REST API and full backend application implementation",
        reason:
          "Well-suited for authentication, data access, exception handling, and structured server development — and the entire team was already familiar with the ecosystem.",
      },
      {
        name: "Spring Security / OAuth2 / JWT",
        role: "Login and authentication/authorization",
        reason:
          "Enables stable token-based auth implementation with seamless Spring Boot integration.",
      },
      {
        name: "JPA / MySQL",
        role: "Core data storage for posts, comments, reports, etc.",
        reason:
          "Well-suited for relational data modeling and CRUD development, with clear expression of entity relationships.",
      },
      {
        name: "Redis",
        role: "Fast data access layer",
        reason:
          "Used to reduce DB load and supplement response performance. Its in-memory nature is ideal for caching frequently accessed data.",
      },
      {
        name: "Selenium + Scheduler",
        role: "Automated news crawling",
        reason:
          "Configured as a scheduler to decouple periodic data collection from user requests.",
      },
      {
        name: "Docker Compose",
        role: "Unified dev and deployment runtime environment",
        reason:
          "Adopted to reduce environment-specific errors among team members and establish a reproducible runtime baseline.",
      },
      {
        name: "GitHub Actions",
        role: "Build and deployment automation",
        reason:
          "Introduced to reduce manual deployments and establish a repeatable deployment flow.",
      },
    ],
    problemSolving: [
      {
        issue: "Same code produced different runtime results across team members' environments.",
        analysis:
          "The root cause was not the feature code itself, but environment mismatches — Java version, dependencies, and execution method differences.",
        solution:
          "Reframed Docker as a tool for standardizing the development environment, not just deployment. Used Docker Compose to define the full stack runtime in code, establishing a consistent baseline for the entire team.",
        result:
          "Established a standard that reduced environment-related errors, and gained a first-hand appreciation for the importance of runtime consistency in collaborative development.",
      },
    ],
    retrospective: {
      improvements:
        "Stably implemented core community features — posts, comments, likes, and reports — and gained experience with a backend architecture beyond simple CRUD through news crawling and analysis service integration.",
      regrets:
        "Initially thought of Docker only as a deployment tool, which delayed leveraging it for development environment standardization and led to wasted time resolving environment-specific errors.",
      futureWork:
        "If the service scales, I plan to further decouple crawling, analysis, and API servers, and enhance async processing, cache strategy, and monitoring.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/Newgnal-Backend",
      demo: "/images/tave_pdf.pdf",
    },
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC Infrastructure",
    period: "Feb 2026 – Mar 2026",
    overview: {
      description:
        "Design and validate a scalable Kubernetes-based platform architecture with centralized network and observability design.",
      role: "As team lead, architected an EKS-based platform with multi-layer autoscaling using KEDA and Karpenter. Designed Central VPC and Transit Gateway architecture to centralize shared services. Validated platform stability under 2,000 RPS with zero downtime.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "The overall structure is divided into Prod, QA, Dev, DR, and Central VPCs. Prod and QA share an EKS-based architecture with CloudFront → ALB (Ingress) → Kubernetes Service → Pod flow, deployed across multiple AZs for availability. The data layer uses Aurora DB + Reader Endpoint + RDS Proxy for read traffic distribution and connection stability. Prod runs On-Demand + Spot NodePools separately; QA uses Spot-focused nodes for cost savings. Central VPC hosts a GitLab server and monitoring stack for centralized multi-environment management. DR is designed as Pilot Light to minimize standby cost while enabling recovery when needed. DNS query flow is Route 53 Resolver → DNS Firewall (ALERT) → Query Logging → CloudWatch Logs → Metric Filter → Alarm → SNS → Lambda → Slack Alert.",
      reasoning:
        "EKS was chosen for its extensibility and ecosystem integration — not just deployment convenience. Its compatibility with KEDA, Karpenter, and IRSA, and the ability to manage deployments consistently via Helm Charts, were key factors. Central VPC reduces operational complexity by centralizing shared services and consolidating logs, alerts, and status from multiple VPCs into a single point. In short, it's not a design that 'splits the network' — it's a design that reduces operational, security, and observability touchpoints.",
    },
    techStack: [
      {
        name: "Terraform",
        role: "Infrastructure provisioning and DR reproducibility",
        reason:
          "Chosen to manage infrastructure as code, reduce manual configuration errors, and maintain a reproducible Pilot Light DR structure.",
      },
      {
        name: "AWS EKS",
        role: "Application execution and orchestration platform",
        reason:
          "Suited for a complex operational environment requiring traffic autoscaling, monitoring, GitOps, and open-source integrations — with strong compatibility with KEDA, Karpenter, and IRSA.",
      },
      {
        name: "KEDA",
        role: "Request-based Pod autoscaling",
        reason:
          "Determined that request-volume-based scaling was more appropriate than CPU/memory metrics. Designed to compute average RPS per Pod from Prometheus metrics and scale accordingly — from a minimum of 45 to a maximum of 110 Pods.",
      },
      {
        name: "Karpenter",
        role: "Node-level autoscaling",
        reason:
          "Increasing Pod count alone was insufficient — schedulable nodes also needed to scale. Designed to automatically provision new nodes upon detecting Pending Pods.",
      },
      {
        name: "ArgoCD / GitOps",
        role: "Declarative deployment state management",
        reason:
          "Adopted to maintain consistent deployment state based on Git and clearly track operational change history.",
      },
      {
        name: "Helm",
        role: "Standardized deployment for applications and operational stacks",
        reason:
          "Used to consistently manage app deployments, monitoring stacks, and autoscaling configurations.",
      },
      {
        name: "Prometheus",
        role: "Metrics collection and scaling decision input",
        reason:
          "Collects /actuator/prometheus metrics to enable KEDA to make request-volume-based scaling decisions.",
      },
      {
        name: "IRSA",
        role: "Per-Pod AWS permission isolation",
        reason:
          "Applied to avoid concentrating permissions on node-level IAM roles — instead granting only the necessary permissions per ServiceAccount to minimize the security blast radius.",
      },
      {
        name: "Route 53 Resolver / DNS Firewall / CloudWatch / SNS / Lambda",
        role: "DNS security observability and alert automation",
        reason:
          "Configured to track external domain access from Central VPC servers and rapidly deliver threat domain detection events to Slack.",
      },
    ],
    problemSolving: [
      {
        issue: "Under heavy load, multiple risks coexisted: traffic hitting unready Pods, slow scaling relative to request volume, and Pending Pods due to insufficient nodes. In practice, node join failures, Pending Pods, MaxPods limits, and ALB health check path mismatches recurred repeatedly.",
        analysis:
          "Analyzed issues by layer: Spring Boot must not receive requests immediately after startup, making readiness criteria critical. HPA alone couldn't adequately reflect actual request volume. Additionally, Private Subnet routing errors prevented worker nodes from communicating with the EKS API, causing join failures; DNS misconfigurations left nodes NotReady; and MaxPods limits caused Pending Pods.",
        solution:
          "Designed multiple layers to work in concert rather than relying on a single solution. Separated startup/readiness/liveness probes and aligned ALB health check paths with readiness. Replaced CPU-based scaling with Prometheus-metric-driven KEDA to scale by average RPS per Pod, and pre-scaled a minimum of 45 Pods to ensure initial capacity. Applied Karpenter to automatically provision new nodes when Pending Pods are detected, and used IRSA for per-Pod permission isolation.",
        result:
          "Sustained approximately 2,000 RPS for 60 seconds in QA, processing 120,000 total requests. This was the result of 45 pre-scaled Pods, aligned readiness/ALB health check criteria, Prometheus-driven KEDA scaling, Karpenter node scaling, and GitOps-based operational consistency all working together.",
      },
    ],
    retrospective: {
      improvements:
        "Validated an EKS-based large-scale traffic handling architecture with real requests. Centralized GitLab, monitoring, and security observability via Central VPC to reduce operational complexity and improve visibility. Built a DNS Firewall + Query Logging + Slack Alert flow to detect and immediately surface network security events.",
      regrets:
        "Resource specs were not refined enough during load testing, resulting in budget overruns. Karpenter was not fully integrated into the GitOps flow, and DNS Firewall was primarily used in ALERT mode without extending to blocking policies.",
      futureWork:
        "Next steps include full GitOps coverage including Karpenter, enhancing Central VPC security policies with BLOCK/detection rules, and refining cost prediction based on load testing.",
    },
    links: {
      velog:
        "https://velog.io/@eomkyeongmun/series/CJ-%EC%98%AC%EB%A6%AC%EB%B8%8C%EB%84%A4%ED%8A%B8%EC%9B%8D%EC%8A%A4-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8",
    },
  },
  {
    category: "devops",
    title: "Personal Portfolio Website",
    period: "Mar 2026 –",
    thumbnail: "/images/real.png",
    overview: {
      description:
        "Build and operate a personal portfolio platform using a fully serverless architecture with automated deployment, observability, and security controls.",
      role: "Solely responsible for the entire lifecycle: Next.js frontend, Puppeteer-based PDF generation, EventBridge + SES feedback pipeline, Terraform IaC, and GitHub Actions CI/CD. Progressively added security (WAF, OAC, HSTS) and observability (X-Ray, CloudWatch, SNS) layers.",
    },
    architecture: {
      diagram: "/images/real.png",
      description:
        "Users receive static pages via external DNS (CNAME) → CloudFront (OAC) → S3. PDF download requests are handled through API Gateway → Lambda (Puppeteer). Feedback submissions flow through API Gateway → Lambda (feedback-handler) → EventBridge (portfolio-events) → Lambda (email-sender) → SES, delivering visitor feedback as real-time email notifications. WAF is placed in front of CloudFront for L7 security, and a Response Headers Policy automatically injects HSTS, X-Frame-Options, and other security headers on all responses. ACM manages HTTPS certificates. The PDF Lambda runs as an ECR container image; the feedback Lambda runs as a zip package. X-Ray provides distributed tracing from API Gateway to Lambda. CloudWatch dashboards and SNS alarms detect Lambda errors, duration, throttling, and API Gateway 5xx in real time. GitHub Actions automates S3 upload → CloudFront cache invalidation for frontend changes, and image build → ECR push → Lambda function update for backend changes.",
      reasoning:
        "Heavy, infrequent workloads like PDF generation are offloaded to Lambda to minimize operational cost without a persistent server. Static content is served globally via CloudFront + S3, with only server-dependent features attached as serverless functions — achieving simplicity and cost efficiency simultaneously. All infrastructure is codified with Terraform for reproducibility and change history management.",
    },
    techStack: [
      {
        name: "Next.js 16 / React / TypeScript",
        role: "Portfolio web pages and PDF-dedicated rendering pages",
        reason:
          "App Router-based static generation (SSG) is optimized for S3 deployment, and TypeScript ensures type-safe data structure management. Compatibility with Tailwind CSS v4 was also a factor.",
      },
      {
        name: "Tailwind CSS v4",
        role: "Responsive UI styling",
        reason:
          "CSS-first configuration allows custom themes to be defined directly in globals.css without a config file. Dark mode support is straightforward with class-based toggling.",
      },
      {
        name: "AWS S3 + CloudFront + OAC",
        role: "Static file origin storage and global CDN delivery",
        reason:
          "S3 is kept private with OAC (Origin Access Control), allowing access only through CloudFront for enhanced security. External DNS is managed via a third-party provider and connected to CloudFront via CNAME.",
      },
      {
        name: "AWS WAF",
        role: "L7 security in front of CloudFront",
        reason:
          "Applied managed rule sets to block common web attacks such as SQL injection and XSS — ensuring a baseline security layer even for a personal portfolio.",
      },
      {
        name: "AWS Lambda + Puppeteer (Container)",
        role: "Serverless PDF generation",
        reason:
          "Puppeteer requires a Chromium binary that exceeds standard Lambda package size limits. Deploying as a container image Lambda resolves this constraint. Since PDF generation is infrequent, Lambda is more cost-efficient than a persistent server.",
      },
      {
        name: "AWS API Gateway",
        role: "HTTP endpoint for Lambda invocation",
        reason:
          "Placed API Gateway in front of Lambda (instead of direct CloudFront invocation) to facilitate request routing, auth extension, and X-Ray tracing integration.",
      },
      {
        name: "AWS ECR",
        role: "Lambda container image registry",
        reason:
          "Managing Lambda container images in AWS's internal registry minimizes deployment latency and systematizes image version control.",
      },
      {
        name: "AWS X-Ray",
        role: "Distributed tracing from API Gateway to Lambda",
        reason:
          "Introduced to visualize Lambda cold start latency and Puppeteer rendering bottlenecks that are difficult to identify from simple error logs alone.",
      },
      {
        name: "Terraform",
        role: "Full infrastructure IaC management",
        reason:
          "All resources — CloudFront, S3, WAF, API Gateway, Lambda, ECR, ACM, IAM — are defined as code, maintaining a reproducible infrastructure without manual console operations. Modularized for per-environment extensibility.",
      },
      {
        name: "GitHub Actions",
        role: "Frontend and Lambda deployment automation",
        reason:
          "On code push: Next.js build → S3 upload → CloudFront cache invalidation, and Lambda image build → ECR push → Lambda function update are fully automated, eliminating manual deployments.",
      },
      {
        name: "CloudWatch + SNS",
        role: "Operational monitoring and alerting",
        reason:
          "CloudWatch Alarms detect Lambda errors, duration threshold breaches, throttling, and API Gateway 5xx — with immediate SNS email notifications. Dashboards provide at-a-glance visibility into invocation trends and latency for faster incident response.",
      },
      {
        name: "CloudFront Response Headers Policy",
        role: "Automatic security header injection",
        reason:
          "Applied HSTS (2 years), X-Frame-Options, X-Content-Type-Options, XSS-Protection, Referrer-Policy, and Permissions-Policy to all responses using AWS managed policies — completing the security layer without CloudFront Functions or ongoing maintenance.",
      },
      {
        name: "Amazon EventBridge + SES",
        role: "Visitor feedback event processing and email notification",
        reason:
          "Instead of directly chaining the feedback-receiver Lambda to the email-sender Lambda, an EventBridge custom bus decouples the two. This enables future additions — Slack notifications, DB storage, etc. — by simply adding new Rules without modifying existing code. Email is sent from the custom domain (eomkyeongmun.me), DKIM-verified via SES for sender credibility.",
      },
    ],
    problemSolving: [
      {
        issue: "Korean text rendered as □□□ when generating PDFs with Puppeteer on Lambda.",
        analysis:
          "Puppeteer's Chromium relies on system fonts. The Lambda runtime environment (Amazon Linux 2) does not include Korean fonts by default, causing Chromium to output □ for Korean characters.",
        solution:
          "Bundled Noto Sans KR font directly into the Lambda container image Dockerfile. Also loaded the font via Google Fonts on the /portfolio/print page and added waitForFunction in Puppeteer to wait for font loading to complete before capturing the PDF.",
        result:
          "Korean fonts now render correctly, with all text displaying properly in the generated PDFs. Bundling fonts into the image ensures consistent output without external network dependency.",
      },
      {
        issue: "After deployment, clicking the back button or home link on a project detail page redirected back to the project page instead of the home page.",
        analysis:
          "Next.js App Router client navigation fetches RSC (React Server Component) payload files for server component rendering. However, GitHub Actions applied Cache-Control: public, max-age=31536000, immutable to all static files uploaded to S3 — including RSC payload files under _next/static/. Even after CloudFront cache invalidation post-deployment, previously cached RSC payloads in the browser referenced stale routing information, causing incorrect navigation.",
        solution:
          "Separated Cache-Control settings in the S3 upload step: applied no-cache to HTML and RSC payload files to always reference the latest version, while keeping immutable for content-hashed JS/CSS files to preserve cache efficiency.",
        result:
          "The post-deployment page navigation issue was resolved. RSC payloads always reference the latest server component output, while static assets retain their long-term cache behavior.",
      },
      {
        issue: "After pushing a Lambda container image to ECR via GitHub Actions, the Lambda function sometimes failed to reflect the new image.",
        analysis:
          "Even after pushing a new image with the latest tag to ECR, Lambda continues using its previously cached image unless the function configuration is explicitly updated. An API call to update the function is required for Lambda to recognize the new image.",
        solution:
          "Added an aws lambda update-function-code step after the ECR push in the GitHub Actions workflow to force Lambda to reference the latest ECR image on every deployment.",
        result:
          "Lambda is now always updated to the latest image on every code push. Changes are reflected immediately with no missed deployments.",
      },
    ],
    retrospective: {
      improvements:
        "Built an entire service end-to-end — from frontend development through serverless backend, IaC, and CI/CD — making all the connections myself. Progressively added production-grade security and observability layers: S3 OAC, WAF, X-Ray, CloudWatch alarms, and security header policies, delivering a structure that goes well beyond simple deployment.",
      regrets:
        "Lambda cold start latency on the first PDF generation request can be noticeable, but I didn't thoroughly evaluate applying Provisioned Concurrency. The Terraform module structure also became more complex than initially designed and needs refactoring.",
      futureWork:
        "Planning to reduce cold start with Lambda Provisioned Concurrency or SnapStart, and add anomalous traffic detection tied to CloudWatch alarms. Will extend the feedback system by adding EventBridge Rules for Slack notifications or DB storage, and refactor Terraform modules into reusable per-environment structures.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
      velog: "https://velog.io/@eomkyeongmun/series/project",
    },
  },
];
