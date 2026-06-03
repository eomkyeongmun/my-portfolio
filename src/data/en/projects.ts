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
    category: "ai",
    title: "Automotive Cybersecurity RAG System",
    period: "Mar 2026 – Jun 2026",
    thumbnail: "/images/rag_arch.svg",
    confidential: true,
    overview: {
      description:
        "A RAG system that answers automotive cybersecurity questions grounded in ISO/SAE 21434, UN R155, and an internal TARA table. The TARA automation tool (tAIRA) calls it at each analysis step to pull in grounding context.",
      role:
        "Solely designed and implemented the entire RAG pipeline — BGE-M3 embeddings, FAISS hybrid retrieval, cross-encoder reranking, and Ollama-based Korean answer generation.",
    },
    architecture: {
      diagram: "/images/rag_arch.svg",
      description:
        "A query is embedded as dense+sparse, retrieved via FAISS, combined with sparse scores at 0.7/0.3, reranked by a cross-encoder to the top 5 chunks, and passed as grounding to Ollama (qwen2.5:3b) to produce a Korean answer. Documents are chunked and embedded offline with incremental indexing.",
      reasoning:
        "Hybrid retrieval (dense + sparse) was chosen to handle both exact identifier/standard-number matching and semantic search, with the expensive cross-encoder applied only to a small top set. The LLM runs on an in-house Ollama model since sensitive TARA data cannot be sent to external APIs.",
    },
    techStack: [
      {
        name: "BGE-M3",
        role: "Dense + sparse embeddings",
        reason: "A single model handles both semantic search and exact identifier matching.",
      },
      {
        name: "FAISS",
        role: "Vector index / candidate retrieval",
        reason: "Lightweight file-based dense search without a separate vector-DB server.",
      },
      {
        name: "Cross-Encoder Reranker",
        role: "Candidate reranking",
        reason: "Applied to the top 20 to correct relevance differences the first-stage search misses.",
      },
      {
        name: "Ollama (qwen2.5:3b)",
        role: "Korean answer generation",
        reason: "An in-house local LLM, since sensitive documents cannot be sent to external APIs.",
      },
      {
        name: "FastAPI",
        role: "Query API / tAIRA integration",
        reason: "Offloads synchronous inference to a thread pool to serve concurrent requests while integrating with tAIRA.",
      },
      {
        name: "Docker Compose",
        role: "Deployment / data separation",
        reason: "Bakes public docs into the image while mounting sensitive TARA data and indexes from a host volume.",
      },
    ],
    problemSolving: [
      {
        issue:
          "Queries about standard/threat identifiers (M013-1, ISO 15.4, etc.) sometimes failed to retrieve the exact matching item.",
        analysis:
          "Semantic embeddings struggle with near-meaningless tokens like identifiers, and the reranker weakened exact matching by splitting identifiers into subwords.",
        solution:
          "Combined sparse scores with dense scores at 0.7/0.3 to reinforce exact-token matching, and branched to bypass the reranker and boost exact sparse matches whenever an ID pattern is detected.",
        result:
          "Identifier queries reliably surface the correct item at the top, while general queries keep their relevance through the reranker.",
      },
      {
        issue:
          "Embedding, FAISS, reranker, and Ollama calls are all synchronous, so the FastAPI async handlers couldn't accept concurrent requests.",
        analysis:
          "Calling the no-async inference libraries directly inside async functions stalls the event loop until the work finishes.",
        solution:
          "Delegated the blocking calls to a thread pool via asyncio.to_thread, and designed the tAIRA integration to gracefully degrade with an empty context on RAG failure.",
        result:
          "Event-loop blocking disappeared under concurrent queries, and tAIRA's TARA analysis continues uninterrupted even if the RAG fails.",
      },
    ],
    retrospective: {
      improvements:
        "Designed an end-to-end RAG pipeline — embedding, hybrid retrieval, reranking, local LLM — with exact matching and incremental indexing built for operation.",
      regrets:
        "Lacked a quantitative evaluation metric (recall@k, etc.), so tuning relied on qualitative judgment.",
      futureWork:
        "Introduce an evaluation harness to quantify tuning and automate index rebuilds and deployment via GitOps.",
    },
    links: {},
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC Infrastructure",
    period: "Feb 2026 – Mar 2026",
    overview: {
      description:
        "Design and validate a scalable Kubernetes-based platform architecture with centralized network and observability design.",
      role: "As team lead, coordinated the overall schedule and direction and drove the Kubernetes-centric architecture design and EKS build.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "Environments are split into Prod / QA / Dev / DR / Central VPC, with Prod and QA running CloudFront → ALB (Ingress) → EKS Pod across multiple AZs. The data layer uses Aurora + RDS Proxy for read distribution and connection stability, and Central VPC consolidates GitLab, monitoring, and DNS security observability for centralized operation. DR is designed as Pilot Light to cut standby cost.",
      reasoning:
        "EKS was chosen for its open-source integration (KEDA, Karpenter, IRSA) and consistent Helm-based operation. Central VPC centralizes shared services to reduce operational complexity and view logs/alerts from multiple environments in one place.",
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
        role: "Application execution / orchestration",
        reason: "Well-suited to a structure with heavy autoscaling, GitOps, and open-source integration needs.",
      },
      {
        name: "KEDA",
        role: "Request-based Pod autoscaling",
        reason: "Scales by average RPS per Pod from Prometheus metrics instead of CPU (45 min ~ 110 max).",
      },
      {
        name: "Karpenter",
        role: "Node-level autoscaling",
        reason: "Auto-provisions nodes on Pending Pods so Pod scaling and node scaling stay matched.",
      },
      {
        name: "ArgoCD / GitOps",
        role: "Declarative deployment state",
        reason: "Keeps deployment state and operational change history consistent based on Git.",
      },
      {
        name: "IRSA",
        role: "Per-Pod AWS permission isolation",
        reason: "Grants only the necessary permissions per ServiceAccount to minimize the blast radius.",
      },
    ],
    problemSolving: [
      {
        issue:
          "Under heavy load, traffic could hit unready Pods, scaling lagged request volume, and Pending Pods occurred when nodes were insufficient.",
        analysis:
          "Spring Boot must not receive requests right after startup, making readiness critical, and HPA alone couldn't reflect actual request volume.",
        solution:
          "Separated startup/readiness/liveness probes and aligned the ALB health check with readiness. Used Prometheus-driven KEDA to scale by average RPS per Pod with 45 Pods pre-scaled, and Karpenter to auto-add nodes on Pending.",
        result:
          "Sustained ~2,000 RPS for 60s in QA, processing 120,000 requests with zero downtime.",
      },
      {
        issue:
          "Worker nodes failed to join the EKS API or went NotReady, and MaxPods limits caused Pending Pods.",
        analysis:
          "Private Subnet routing errors and DNS misconfiguration prevented nodes from reaching the control plane.",
        solution:
          "Fixed subnet routing and DNS settings and tuned MaxPods / instance types so nodes joined properly.",
        result:
          "Node join failures and Pending issues were resolved, and autoscaling ran stably.",
      },
    ],
    retrospective: {
      improvements:
        "Validated an EKS-based large-scale traffic architecture with real requests and centralized GitLab, monitoring, and DNS security observability via Central VPC.",
      regrets:
        "Resource specs weren't refined enough during load testing, causing budget overruns, and Karpenter wasn't fully integrated into the GitOps flow.",
      futureWork:
        "Plan full GitOps coverage including Karpenter and enhanced DNS Firewall blocking policies.",
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
      role: "Solely responsible for the entire lifecycle: Next.js frontend, Puppeteer-based PDF generation, feedback notification system, Terraform IaC, and GitHub Actions CI/CD.",
    },
    architecture: {
      diagram: "/images/real.png",
      description:
        "Static pages are served via CloudFront (OAC) → S3, while PDF generation and feedback submission go through API Gateway → Lambda. Feedback is loosely coupled to an email-sender Lambda via EventBridge, and WAF, security headers, X-Ray, and CloudWatch alarms cover security and observability. GitHub Actions automates S3 upload, cache invalidation, and Lambda image deployment.",
      reasoning:
        "Heavy, infrequent work like PDF generation is offloaded to Lambda to minimize cost without a persistent server, while static content is cached via CloudFront + S3. All infrastructure is codified with Terraform for reproducibility.",
    },
    techStack: [
      {
        name: "Next.js 16 / React / TypeScript",
        role: "Web pages and PDF rendering page",
        reason: "App Router static generation (SSG) is optimized for S3 deployment with type-safe data structures.",
      },
      {
        name: "AWS S3 + CloudFront + OAC",
        role: "Static file storage / global CDN",
        reason: "S3 stays private with OAC, accessible only through CloudFront for stronger security.",
      },
      {
        name: "AWS Lambda + Puppeteer (Container)",
        role: "Serverless PDF generation",
        reason: "A container image Lambda solves the Chromium package-size limit and is cost-efficient for infrequent requests.",
      },
      {
        name: "AWS API Gateway",
        role: "HTTP endpoint for Lambda",
        reason: "Placed in front of Lambda for request routing, auth extension, and X-Ray tracing.",
      },
      {
        name: "Amazon EventBridge + SES",
        role: "Feedback event processing / email",
        reason: "Decouples receiver and sender Lambdas so Slack/DB extensions need only a new Rule.",
      },
      {
        name: "Terraform",
        role: "Full infrastructure IaC",
        reason: "Defines CloudFront, S3, WAF, API Gateway, Lambda, and more as code for reproducible infrastructure.",
      },
      {
        name: "GitHub Actions",
        role: "Frontend / Lambda deployment automation",
        reason: "On push: build → S3 upload → cache invalidation and Lambda image build/deploy, eliminating manual deployment.",
      },
    ],
    problemSolving: [
      {
        issue: "Korean text rendered as □□□ when generating PDFs with Puppeteer on Lambda.",
        analysis:
          "Chromium relies on system fonts, and the Lambda runtime had no Korean font to render with.",
        solution:
          "Bundled Noto Sans KR into the container image and added waitForFunction on the print page so the PDF is captured only after fonts finish loading.",
        result:
          "Korean renders correctly, and bundling fonts into the image guarantees consistent PDFs with no external network dependency.",
      },
      {
        issue: "After deployment, back/home navigation on a project detail page redirected back to the project page instead of home.",
        analysis:
          "Applying immutable caching to all static files also long-cached the RSC payloads, so the browser referenced stale routing information.",
        solution:
          "Split Cache-Control on S3 upload: no-cache for HTML and RSC payloads, immutable only for content-hashed JS/CSS.",
        result:
          "The redirect issue was resolved while static assets keep their long-term cache efficiency.",
      },
    ],
    retrospective: {
      improvements:
        "Built the whole service end-to-end alone and added production-grade security and observability — WAF, X-Ray, CloudWatch alarms.",
      regrets:
        "Didn't fully address Lambda cold start on the first PDF request, and the Terraform module structure grew complex and needs refactoring.",
      futureWork:
        "Reduce cold start with Provisioned Concurrency or SnapStart and extend the feedback system to Slack/DB.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
      velog: "https://velog.io/@eomkyeongmun/series/project",
    },
  },
];
