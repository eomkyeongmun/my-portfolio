import type { Project } from "@/data/projects";

export const projects: Project[] = [
  {
    category: "backend",
    title: "CrossView",
    period: "Jun 2026 –",
    overview: {
      description:
        "A study platform where people preparing for career transitions share resumes and practice mock interviews together. It started as a simple idea — 'online interview study groups would be convenient' — but once I actually deployed and started running it, I found myself facing a completely different kind of problem: 'how do I keep the costs under control to sustain a personal project long-term?'",
      role: "Solely designed, implemented, and operating the entire stack: frontend (Next.js), backend (Spring Boot), infrastructure (Terraform), and CI/CD (GitHub Actions). I spent more time building 'a structure I can operate alone and reliably' than on feature development.",
    },
    architecture: {
      diagram: "/images/crossview_arch.svg",
      description:
        "Spring Boot, PostgreSQL, Redis, and Next.js run together via Docker Compose on a single EC2 instance. DB backups are automated with Spring Batch: pg_dump → S3 upload → local cleanup, running daily at 3 AM. When an error occurs, a custom Logback Appender catches it, sends it to Bedrock Claude Haiku for root-cause analysis, and delivers the result via email and Slack.",
      reasoning:
        "My first instinct was to use RDS — it's the obvious choice. But when I priced it out, even a db.t3.micro came to ~$15/month, and with storage and backup costs on top, it rivaled the EC2 bill itself. I asked myself: 'Does this service actually need RDS-level availability?' Honestly, for a study platform with a few dozen users, Multi-AZ failover was overkill. So I put PostgreSQL in Docker on EC2 and covered the data loss risk with daily S3 backups. An RPO of 24 hours means 'worst case, I lose one day of data' — and for this service, that's an acceptable tradeoff. For error alerting, I originally planned to just collect logs and email them. But after waking up to error emails at 3 AM and having to judge 'is this urgent or not?' every single time, it got exhausting. So I plugged in Bedrock Claude — but to keep costs predictable, I chose the cheapest Haiku model, capped context at 50 recent log lines, and added a 10-minute dedup cooldown for identical errors. The principle was: 'use AI, but never let the cost become unpredictable.'",
    },
    techStack: [
      {
        name: "Spring Boot / JPA / QueryDSL",
        role: "REST API, domain logic, dynamic queries",
        reason:
          "With 15 entities and complex relationships (groups, memberships, resumes, evaluations — lots of many-to-many), and dynamic filtering on the recruitment board, QueryDSL's type-safe query building made long-term maintenance far easier than string-based JPQL.",
      },
      {
        name: "Docker Compose + PostgreSQL",
        role: "Application runtime + data storage",
        reason:
          "RDS would have been convenient, but its monthly cost nearly matched the EC2 bill. When I honestly evaluated whether a personal project needs managed DB features like automatic backups and failover, the answer was no — Docker PostgreSQL plus S3 backups was sufficient. More operational overhead, but less than half the cost.",
      },
      {
        name: "Spring Batch + S3",
        role: "Daily DB backup automation",
        reason:
          "A cron job with a shell script could have done it, but I needed retry on failure, alerting, and execution history tracking. Spring Batch's Job/Step structure cleanly separated the three stages — pg_dump, S3 upload, local cleanup — and JobParameters prevented duplicate runs for free.",
      },
      {
        name: "Bedrock Claude Haiku + Logback",
        role: "Automated error analysis and alerting",
        reason:
          "Receiving raw error logs by email meant I had to judge 'is this urgent or ignorable?' every time. Automating root-cause analysis and severity assessment with Haiku cut that cognitive load. To control costs: 50-line context cap, 10-minute dedup cooldown, async thread pool capped at 3. The design uses AI while keeping costs predictable.",
      },
      {
        name: "Terraform",
        role: "Full AWS infrastructure as code",
        reason:
          "With 10+ resources (EC2, S3, Security Groups, CloudWatch alarms...), managing them through the console would inevitably lead to 'why is this security group rule open?' Code preserves intent in version history and makes the entire environment reproducible.",
      },
      {
        name: "GitHub Actions CI/CD",
        role: "Build, test, and deployment automation",
        reason:
          "CI spins up PostgreSQL and Redis service containers to test against real databases. CD temporarily opens the SSH port only to the GitHub Actions runner's IP during deployment, then closes it when done — whether the deploy succeeds or fails. I built this because leaving SSH open 24/7 made me uneasy.",
      },
    ],
    problemSolving: [
      {
        issue:
          "Running the DB on RDS for a personal project meant monthly costs rivaled the EC2 bill, making long-term operation unsustainable.",
        analysis:
          "RDS db.t3.micro alone was ~$15/month; add storage and backup costs and it approached the EC2 t3.medium cost (~$30). For a study platform with dozens of users, Multi-AZ failover and automatic backups felt like paying for insurance I'd never claim. I realized I could 'build just the level of reliability I actually need' and cut costs in half.",
        solution:
          "Removed RDS and switched to Docker PostgreSQL on EC2. Automated daily backups at 3 AM via Spring Batch: pg_dump → S3 upload → local cleanup (files older than 7 days). The S3 bucket has a 30-day lifecycle policy, so backup storage costs are also automatically controlled.",
        result:
          "DB-related monthly costs dropped from ~$15 to ~$0.1 (S3 storage). Accepting an RPO of 24 hours was a deliberate tradeoff matched to the service's actual requirements.",
      },
      {
        issue:
          "When error alert emails arrived at odd hours, manually reading stack traces and judging severity every time was draining.",
        analysis:
          "Forwarding raw logs was 'notification,' not 'analysis.' In a solo-operated project, manually triaging every error isn't sustainable. I needed AI to handle first-pass analysis, but the cost had to stay controllable.",
        solution:
          "A custom Logback Appender catches ERROR-level logs from the com.crossview package, excluding the alert service's own logs to prevent infinite loops. Caught errors are processed asynchronously with hash-based 10-minute dedup cooldown, then sent to Bedrock Haiku with the last 50 log lines for root-cause analysis, severity assessment, and remediation suggestions — delivered via email and Slack. Thread pool capped at 3, context limited to 50 lines — keeping AI call costs within a predictable range.",
        result:
          "Error alerts now arrive with AI analysis, so I can judge 'do I need to look at this now?' from the subject line alone. Haiku costs stay under $1/month.",
      },
      {
        issue:
          "Keeping EC2's SSH port (22) open 24/7 for deployment automation was a security concern.",
        analysis:
          "The CD pipeline SSHes into EC2 to deploy, but opening port 22 to 0.0.0.0/0 exposes it to brute-force attempts. Deployments happen a few times a day at most — leaving the port open around the clock was both wasteful and risky.",
        solution:
          "The GitHub Actions CD workflow queries the runner's public IP, opens SSH only for that IP in the Security Group, deploys, then removes the rule on completion — on both success and failure. The port is open only during deployment, only to the specific IP that needs it.",
        result:
          "SSH port exposure dropped from 24 hours to a few minutes per deployment, maintaining automation without sacrificing security.",
      },
    ],
    retrospective: {
      improvements:
        "What I learned most from this project wasn't 'how to build features' — it was 'how to balance operational cost against reliability.' Dropping RDS, designing AI cost controls, automating deployment security — all of these came from asking 'what's the right level for this service's scale?'",
      regrets:
        "Monitoring is heavily skewed toward error alerting; performance metrics (response times, DB query latency) are still lacking. CloudWatch alarms focus on CPU, and application-level observability needs strengthening.",
      futureWork:
        "Add Prometheus + Grafana for application metrics collection, and automate backup recovery testing to regularly verify that the 24-hour RPO actually holds.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my_own",
      demo: "https://crossview.duckdns.org",
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
        "Built to eliminate the inefficiency of cybersecurity engineers manually searching through ISO/SAE 21434, UN R155, and internal TARA tables for every query. The TARA automation tool (tAIRA) calls this system at each analysis step to pull in grounding context.",
      role:
        "Solely designed and implemented the entire RAG pipeline — from embedding model selection to retrieval strategy, LLM answer generation, and API integration. The core challenge was finding the best architecture under two constraints: 'identifiers must be found exactly' and 'sensitive data must never leave the company network.'",
    },
    architecture: {
      diagram: "/images/rag_arch.svg",
      description:
        "A query is embedded as dense+sparse via BGE-M3, retrieved via FAISS, scores combined at 0.7/0.3, reranked by a cross-encoder to the top 5 chunks, and passed as grounding to Ollama (qwen2.5:3b) for Korean answer generation. Documents are chunked and embedded offline with incremental indexing.",
      reasoning:
        "I initially assumed dense search alone would suffice, but queries like 'What is threat M013-1?' returned irrelevant results — semantic embeddings can't distinguish meaningless identifier codes. So I switched to a hybrid approach, and BGE-M3 conveniently produces both dense and sparse vectors in a single encoding, keeping the pipeline simple. The cross-encoder dramatically improved relevance but was too slow to apply to all results, so I limited it to the top 20 — a tradeoff between accuracy and latency. For the LLM, GPT-4 would have been better, but TARA data is confidential and cannot leave the company network, so I accepted some quality loss and deployed Ollama locally.",
    },
    techStack: [
      {
        name: "BGE-M3",
        role: "Dense + sparse embeddings",
        reason: "Running separate dense and sparse models would have complicated the pipeline. BGE-M3 produces both vectors in a single pass, keeping the architecture simple.",
      },
      {
        name: "FAISS",
        role: "Vector index / candidate retrieval",
        reason: "I considered Milvus and Weaviate, but with only a few thousand documents, spinning up a dedicated vector DB server felt excessive. File-based FAISS was sufficient and simpler to deploy.",
      },
      {
        name: "Cross-Encoder Reranker",
        role: "Candidate reranking",
        reason: "First-stage retrieval ranking wasn't satisfactory. The cross-encoder evaluates query-chunk pairs together for much more accurate relevance, but it's too slow for all results — so I limited it to the top 20.",
      },
      {
        name: "Ollama (qwen2.5:3b)",
        role: "Korean answer generation",
        reason: "GPT-4 produced better answers, but TARA data is confidential and can't be sent to external APIs. Among models that could run locally, qwen2.5 had decent Korean performance, and the 3b size balanced response speed with quality.",
      },
      {
        name: "FastAPI",
        role: "Query API / tAIRA integration",
        reason: "tAIRA is Python-based, so using the same language for integration was natural. Since all inference calls are synchronous blocking, I needed an async framework to delegate them to a thread pool via asyncio.to_thread.",
      },
      {
        name: "Docker Compose",
        role: "Deployment / data separation",
        reason: "Public standard documents are baked into the image, while sensitive TARA data and indexes are mounted from host volumes. This allows image-only updates for deployment without risking data leakage.",
      },
    ],
    problemSolving: [
      {
        issue:
          "Queries like 'Explain threat M013-1' returned irrelevant results instead of the exact matching item.",
        analysis:
          "Dense embeddings can't distinguish meaningless codes like 'M013-1' from general words like 'automotive' or 'security.' The reranker made it worse by splitting identifiers into subwords, actually weakening exact matching.",
        solution:
          "Combined dense (0.7) + sparse (0.3) scores to reinforce exact token matching, and added a branch: when an ID pattern (M013-1, ISO 15.4, etc.) is detected, bypass the reranker and boost sparse exact matches instead. The key insight was abandoning the assumption that all queries should go through the same pipeline.",
        result:
          "Identifier queries now reliably surface the correct item at the top, while general queries still benefit from the reranker for relevance.",
      },
      {
        issue:
          "With 2+ concurrent queries, later requests stalled until the first finished — embedding, FAISS, reranker, and Ollama calls are all synchronous blocking.",
        analysis:
          "FastAPI is async, but inference libraries are synchronous. Calling them directly inside async functions blocks the entire event loop.",
        solution:
          "Delegated all blocking calls to a thread pool via asyncio.to_thread. Also designed tAIRA integration to gracefully degrade with empty context on RAG failure — RAG is an auxiliary tool and should never block tAIRA's core analysis flow.",
        result:
          "Event-loop blocking under concurrent queries disappeared, and tAIRA's TARA analysis continues uninterrupted even when RAG fails.",
      },
    ],
    retrospective: {
      improvements:
        "Designed the entire RAG pipeline from scratch and learned that 'per-query-type branching' is more practical than a 'one-size-fits-all pipeline.'",
      regrets:
        "Without quantitative evaluation (recall@k, etc.), tuning relied on 'does the result look right?' — I could never be sure whether a change was actually an improvement or a regression.",
      futureWork:
        "Build an evaluation harness to quantify tuning and automate index rebuilds and deployment via GitOps.",
    },
    links: {},
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC Infrastructure",
    period: "Feb 2026 – Mar 2026",
    overview: {
      description:
        "Started from the desire to design a Kubernetes platform that could actually handle production-level traffic. Built an EKS-based application platform and Central VPC centralized operations network, then validated the architecture with 2,000 RPS and 120K total requests in QA.",
      role: "As team lead, coordinated the schedule and direction while driving the EKS-centric architecture design. My focus was on predicting 'where will it break first under load?' and preparing for it proactively.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "Five environments — Prod / QA / Dev / DR / Central VPC. Prod and QA run CloudFront → ALB (Ingress) → EKS Pod across multiple AZs. Data layer uses Aurora + RDS Proxy. Central VPC consolidates GitLab, monitoring, and DNS security observability.",
      reasoning:
        "I considered ECS but wanted fine-grained autoscaling control via open-source tools like KEDA and Karpenter, plus consistent Helm-based config management across environments — so EKS was the better fit. Central VPC wasn't in the original design; I added it after realizing that setting up monitoring separately per environment scattered alerts and made it impossible to see the whole picture. DR used Pilot Light because Active-Active was beyond budget — maintaining minimal resources in standby and scaling up on failure was the cost-recovery tradeoff.",
    },
    techStack: [
      {
        name: "Terraform",
        role: "Infrastructure provisioning and DR reproducibility",
        reason:
          "Managing five environments manually via console would inevitably lead to configuration drift. DR especially needs to be code-defined — if you can't reproduce it reliably, it's useless when you actually need it.",
      },
      {
        name: "AWS EKS",
        role: "Application execution / orchestration",
        reason: "I debated ECS, but KEDA for RPS-based scaling and Karpenter for automatic node provisioning required the Kubernetes ecosystem. I wanted a structure where 'both Pods and nodes scale together when traffic rises.'",
      },
      {
        name: "KEDA",
        role: "Request-based Pod autoscaling",
        reason: "HPA's CPU-based scaling had poor correlation with actual user traffic. Scaling by average RPS per Pod from Prometheus metrics responds to real load, and pre-scaling 45 Pods absorbed cold start issues.",
      },
      {
        name: "Karpenter",
        role: "Node-level autoscaling",
        reason: "Even if KEDA scales Pods, they go Pending without enough nodes. Cluster Autoscaler was too slow; Karpenter detects Pending Pods and provisions right-sized nodes quickly, keeping Pod and node scaling in sync.",
      },
      {
        name: "ArgoCD / GitOps",
        role: "Declarative deployment state",
        reason: "Running kubectl apply manually makes it impossible to be sure the live environment matches Git. With five environments, Git as the single source of truth for deployment state and history was essential.",
      },
      {
        name: "IRSA",
        role: "Per-Pod AWS permission isolation",
        reason: "Attaching an IAM Role to a node gives every Pod on that node the same permissions. Mapping only needed permissions per ServiceAccount to each Pod minimizes the blast radius.",
      },
    ],
    problemSolving: [
      {
        issue:
          "During load testing, Spring Boot Pods received traffic before boot completed, HPA scaling lagged behind traffic increases, and Pods went Pending when nodes were insufficient.",
        analysis:
          "Spring Boot takes 10–15 seconds to boot, but Pods were registered to the service immediately without a readiness probe. HPA used CPU metrics, so its reaction timing diverged from actual request volume. Pod scaling without node scaling created a compounding problem.",
        solution:
          "Separated startup/readiness/liveness probes to block traffic before boot completes. Switched to KEDA with average RPS per Pod scaling, pre-scaled 45 Pods for initial load absorption, and added Karpenter for automatic node provisioning on Pending — aligning Pod and node scaling timing.",
        result:
          "Sustained ~2,000 RPS for 60 seconds in QA, processing 120,000 requests with zero downtime.",
      },
      {
        issue:
          "Worker nodes failed to join the EKS API or fell into NotReady state.",
        analysis:
          "I initially assumed it was a node-level issue, but the actual cause was that Private Subnet routing tables weren't going through the NAT Gateway, so nodes couldn't reach the control plane. A network configuration error, not a compute one.",
        solution:
          "Fixed subnet routing and DNS settings, and also adjusted MaxPods limits per instance type. After this experience, I created an EKS network checklist to prevent the same mistake when adding new environments.",
        result:
          "Node join issues were resolved and Karpenter-based autoscaling operated stably.",
      },
    ],
    retrospective: {
      improvements:
        "The biggest takeaway was validating a designed architecture against real load. Architecture on paper and architecture under traffic are different things — I experienced that firsthand.",
      regrets:
        "Didn't simulate resource specs thoroughly before load testing, which caused AWS cost overruns. Karpenter configuration wasn't fully integrated into the GitOps flow before the project ended.",
      futureWork:
        "Full GitOps automation including Karpenter, and a cost simulation process before load testing.",
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
        "Tired of manually creating portfolio PDFs every time someone asked, I decided to build a site that serves the portfolio on the web and auto-generates PDFs. Since I was building it anyway, I set a goal of handling everything solo — frontend to infrastructure to CI/CD.",
      role: "Solely responsible for the full stack: Next.js frontend, Puppeteer PDF generation, feedback notification system, Terraform IaC, and GitHub Actions CI/CD. My personal bar was 'one push deploys everything.'",
    },
    architecture: {
      diagram: "/images/real.png",
      description:
        "Static pages served via CloudFront (OAC) → S3. PDF generation and feedback submission go through API Gateway → Lambda. Feedback is loosely coupled to an email-sender Lambda via EventBridge. WAF, security headers, X-Ray, and CloudWatch alarms provide security and observability.",
      reasoning:
        "Running a Next.js server on EC2 would have been simplest, but a portfolio site has almost no traffic — paying for an always-on server felt wasteful. I made static pages nearly free with S3+CloudFront and isolated only heavy, infrequent work (PDF generation) into Lambda. For the feedback system, I initially had the receiver Lambda send emails directly, but realized that adding Slack or DB storage later would mean modifying the Lambda every time. Decoupling via EventBridge means I can add new consumers just by adding Rules.",
    },
    techStack: [
      {
        name: "Next.js 16 / React / TypeScript",
        role: "Web pages and PDF rendering page",
        reason: "I considered Gatsby, but App Router's SSG was a perfect fit for S3 deployment. TypeScript catches data structure changes at compile time, which matters when portfolio data evolves frequently.",
      },
      {
        name: "AWS S3 + CloudFront + OAC",
        role: "Static file storage / global CDN",
        reason: "I was uncomfortable making S3 public, so I restricted access via OAC to CloudFront only. A global CDN might be overkill for a portfolio, but CloudFront's caching and HTTPS handling were convenient enough to include.",
      },
      {
        name: "AWS Lambda + Puppeteer (Container)",
        role: "Serverless PDF generation",
        reason: "Puppeteer's Chromium binary exceeds 250MB, breaking the ZIP Lambda size limit (50MB). Switching to a container image Lambda removed the size constraint, and with only a few PDF requests per day, it's far cheaper than running a server.",
      },
      {
        name: "AWS API Gateway",
        role: "HTTP endpoint for Lambda",
        reason: "I could expose Lambda URLs directly, but adding auth or rate limiting later requires API Gateway. X-Ray tracing integrates here with a single toggle.",
      },
      {
        name: "Amazon EventBridge + SES",
        role: "Feedback event processing / email",
        reason: "If the receiver Lambda sends emails directly, adding Slack or DB storage means modifying Lambda code each time. EventBridge lets me add new consumers with just a Rule — no code changes needed.",
      },
      {
        name: "Terraform",
        role: "Full infrastructure IaC",
        reason: "With 10+ resources (CloudFront, S3, WAF, Lambda...), manual console management would inevitably lead to 'why is this configured this way?' Defining everything as code preserves intent in version history and makes the entire environment reproducible.",
      },
      {
        name: "GitHub Actions",
        role: "Frontend / Lambda deployment automation",
        reason: "Manually running build → S3 upload → cache invalidation kept leading to missed steps. Automating the full flow on push eliminated deployment mistakes entirely.",
      },
    ],
    problemSolving: [
      {
        issue: "Korean text rendered as □□□ when generating PDFs with Puppeteer on Lambda.",
        analysis:
          "Chromium uses system fonts, and the Lambda container had no Korean fonts at all. It worked locally but broke on Lambda — I initially suspected an encoding issue, but the root cause was missing fonts.",
        solution:
          "Bundled Noto Sans KR into the container image and added waitForFunction on document.fonts.ready before PDF capture. Relying on an external CDN could break again depending on network conditions, so bundling was the safer choice.",
        result:
          "Korean renders consistently, and bundling fonts guarantees identical results regardless of the runtime environment.",
      },
      {
        issue: "After deployment, clicking back/home from a project detail page redirected back to the project page instead of home.",
        analysis:
          "The problem was applying immutable caching to all static files — including Next.js RSC payloads (.rsc), which also got long-cached. The browser kept referencing stale routing data. My naive assumption that 'all static files can be cached forever' was the root cause.",
        solution:
          "Split Cache-Control by file type during S3 upload: no-cache for HTML and RSC payloads, immutable only for content-hashed JS/CSS.",
        result:
          "Routing issue resolved. Hashed assets still benefit from long-term caching.",
      },
    ],
    retrospective: {
      improvements:
        "Building everything from frontend to serverless backend, IaC, and CI/CD solo was the biggest learning experience. Adding WAF, X-Ray, and CloudWatch alarms taught me the real difference between 'working' and 'operable.'",
      regrets:
        "Lambda cold start on the first PDF request still takes ~10 seconds and remains unresolved. Terraform modules grew complex and need refactoring.",
      futureWork:
        "Reduce cold start with Provisioned Concurrency and extend the feedback system to Slack and DB via EventBridge Rules.",
    },
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
      velog: "https://velog.io/@eomkyeongmun/series/project",
    },
  },
];
