import type { Project } from "@/data/projects";

export const projects: Project[] = [
  {
    category: "backend",
    title: "CrossView",
    period: "Jun 2026 –",
    overview: {
      description:
        "A study platform where people preparing for career transitions share resumes and practice mock interviews together. It started as a simple idea — 'online interview study groups would be convenient' — but once I actually deployed and started running it, I found myself facing a completely different kind of problem: 'how do I keep the costs under control to sustain a personal project long-term?'",
      role: "Solely designed, implemented, and operating the entire stack: frontend (Next.js), backend (Spring Boot), infrastructure (Terraform), and CI/CD (GitHub Actions). I spent more time building 'a structure I can operate alone and reliably' than on feature development. Once the features worked, I re-read the codebase from scratch looking for the places that run fine today but collapse when conditions change — concurrency, query growth, transaction boundaries, schema management — and fixed each one alongside a reproduction test.",
    },
    architecture: {
      diagram: "/images/crossview_arch.svg",
      description:
        "Spring Boot, PostgreSQL, Redis, and Next.js run together via Docker Compose on a single EC2 instance. DB backups are automated with Spring Batch: pg_dump → S3 upload → local cleanup, running daily at 3 AM. When an error occurs, a custom Logback Appender catches it, sends it to Bedrock Claude Haiku for root-cause analysis, and delivers the result via email and Slack. More recently I added a remote-ops layer: Claude Code runs resident inside the server under tmux+systemd, reachable from my phone over outbound-only remote-control, so an incident alert lets me direct a fix — code change → git push → confirm the existing CD pipeline deploys it — from wherever I am.",
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
          "Receiving raw error logs by email meant I had to judge 'is this urgent or ignorable?' every time. Haiku takes over that judgment call — root-cause analysis and severity assessment — and in exchange I capped context at 50 lines, added a 10-minute dedup cooldown, and limited the async thread pool to 3, so the cost of running it stays bounded.",
      },
      {
        name: "Terraform",
        role: "Full AWS infrastructure as code",
        reason:
          "With 10+ resources (EC2, S3, Security Groups, CloudWatch alarms...), managing them through the console would inevitably lead to 'why is this security group rule open?' Code preserves intent in version history and makes the entire environment reproducible.",
      },
      {
        name: "Flyway",
        role: "Database schema version control",
        reason:
          "I started with ddl-auto=update. It was fast to develop against, but it leaves you unable to answer 'what state is production actually in?' from the code. Dropped columns never get applied, nothing is reversible, and there is nothing to review. Moving to Flyway turned schema changes into SQL files that go through code review, and left JPA with a single job via ddl-auto=validate: fail startup when entities and the real schema diverge. Failing at deploy time is far better than discovering a missing column at runtime.",
      },
      {
        name: "Claude Code (Remote Control)",
        role: "AI agent resident on the server for remote ops",
        reason:
          "Getting an incident email at night was useless if I wasn't at my computer to act on it. Leaving SSH open around the clock for phone access would have broken this server's security model, which closes port 22 by default. Remote-control keeps only an outbound connection alive, and I withheld deploy rights from it — it can commit and git push, nothing more — so the existing CD pipeline's build, health check, and rollback safeguards stay exactly as they were.",
      },
    ],
    problemSolving: [
      {
        issue:
          "Running the DB on RDS for a personal project meant monthly costs rivaled the EC2 bill, making long-term operation unsustainable.",
        analysis:
          "RDS db.t3.micro alone was ~$15/month; add storage and backup costs and it approached the EC2 t3.medium cost (~$30). For a study platform with dozens of users, Multi-AZ failover and automatic backups felt like paying for insurance I'd never claim. I realized I could 'build just the level of reliability I actually need' and cut costs in half.",
        solution:
          "Removed RDS and switched to Docker PostgreSQL on EC2, and split the backup job into three Spring Batch Steps: pg_dump → S3 upload → local cleanup. The ordering matters: if the S3 upload fails but the next Step (local cleanup) runs anyway, the original file could end up nowhere — not in S3, not on disk. So a failed upload throws and stops the Job right there, before cleanup ever runs. The S3 bucket also carries a 30-day lifecycle policy, so backup storage is pruned automatically too.",
        result:
          "DB-related monthly costs dropped from ~$15 to effectively $0 — comfortably inside the S3 free tier (5GB). Accepting an RPO of 24 hours was a deliberate tradeoff matched to the service's actual requirements.",
      },
      {
        issue:
          "When error alert emails arrived at odd hours, manually reading stack traces and judging severity every time was draining.",
        analysis:
          "Forwarding raw logs was 'notification,' not 'analysis.' In a solo-operated project, manually triaging every error isn't sustainable. But handing that judgment to AI raised a new question — 'can I actually leave this running?' — and I didn't want the cost of automation to eat the benefit of it.",
        solution:
          "A custom Logback Appender catches only ERROR-level logs from the com.crossview package, excluding the alert service's own logs to prevent infinite loops. Caught errors are processed asynchronously with a hash-based 10-minute dedup cooldown, then sent to Bedrock Haiku with the last 50 log lines for root-cause analysis, severity assessment, and remediation suggestions — delivered via email and Slack. Thread pool capped at 3, context limited to 50 lines, so the cost stays bounded no matter how noisy things get.",
        result:
          "I can now judge 'do I need to look at this right now?' from the AI summary in the subject line alone. Early on, though, both real server bugs and client-side mistakes triggered alerts — after a few days of that noise, I tightened the filter so only genuine server errors page me.",
      },
      {
        issue:
          "Re-reading the join logic, I realized a 6-person group could logically end up with 7 members.",
        analysis:
          "The flow was 'check capacity, then add the member' — and I had missed that another request can slip between those two steps. With one seat left, two simultaneous requests both see room and both insert. Duplicate joins are caught by the unique(user_id, group_id) constraint, but 'member count <= capacity' is not the kind of condition a database constraint can express, so the application has to guarantee it. Worse, the capacity check read the JPA collection size, and a collection loaded into the persistence context cannot see a member another transaction just inserted — it was the wrong basis for the decision to begin with. I wrote the reproduction test first: with a 2-person group that already had its owner, 10 concurrent join requests all succeeded.",
        solution:
          "I took a write lock on the group row (SELECT ... FOR UPDATE) to serialize joins for that group. I considered optimistic locking, but inserting a membership does not modify the group row, so no version would ever bump. Since the lock scope is a single group, joins to different groups never wait on each other, which made pessimistic locking the right fit. The capacity check now uses a COUNT query instead of the collection size. Duplicate joins still rely on the unique constraint as the last line of defense, but saveAndFlush surfaces the violation inside the service so it can be translated into a domain error — with plain save, the INSERT is deferred to commit, the exception escapes the service, and the user gets a 500. As a safety net for any path I might have missed, I also added a DataIntegrityViolationException handler in the GlobalExceptionHandler that maps to a 409. The recruitment-approval path had the same race, so it got the same treatment.",
        result:
          "In the same reproduction test, exactly 1 of 10 succeeded and the rest were rejected as full, leaving exactly 2 members. I also verified that 5 concurrent requests from the same user still produce exactly 1 membership. To confirm the test actually catches regressions rather than passing by coincidence, I removed the lock again and watched it fail immediately (expected 1, got 10). Race conditions cannot be reproduced with mocks, and a rollback-based @Transactional test cannot run multiple transactions at once, so this lives as an integration test using a real database and real threads. This work brought the full suite to 50 passing tests.",
      },
      {
        issue:
          "The recruitment board's 'current members' count was computed as group.getMemberships().size() — loading every membership row just to display a single number.",
        analysis:
          "The screen only needs a count, but the whole collection was landing in the persistence context to produce it. A detail view (one group) can just run a single COUNT query, but a list view has many groups on one page — counting each group separately would just be a different N+1. So a single-item view and a list view can't be solved the same way.",
        solution:
          "I introduced a projection interface, GroupMemberCount (groupId, memberCount), and for list views, collected all the group IDs on the page and ran one IN + GROUP BY query to aggregate member counts into a Map. For the detail view, where there's exactly one group, batching adds nothing, so it keeps a plain COUNT query. Same underlying problem, different fix depending on the calling context.",
        result:
          "List queries now issue exactly one aggregate query regardless of how many groups are on the page. The same change grew the test suite covering this logic from 24 to 48 tests, locking in the regression.",
      },
      {
        issue:
          "Production schema was managed by ddl-auto=update, which meant the code could not tell me what state the database was actually in.",
        analysis:
          "Hibernate reshaping tables on entity changes was convenient, but it leaves no history, nothing to roll back, and nothing to review. Column drops and type changes are not applied at all, so over time the schema the entities describe and the schema that exists quietly diverge. At the same time, introducing a migration tool against a database that already holds real data made me cautious: done carelessly, the first deploy tries to recreate existing tables and fails, or worse, touches data.",
        solution:
          "I first extracted the DDL Hibernate actually generates from the entities and made that the V1 baseline — starting from the real artifact rather than hand-writing something that could subtly differ from production. Then baseline-on-migrate makes a database that already has tables record V1 as applied without executing it, so production is untouched and only V2 (indexes) runs. Fresh databases (local, CI) execute V1 onward, keeping environments identical. Finally ddl-auto moved to validate, so a mismatch between entities and the real schema fails startup.",
        result:
          "I verified both paths against real PostgreSQL 16 before deploying. On an empty database V1 and V2 applied in order; on a database with the pre-existing schema, V1 was recorded as a baseline and only V2 ran, adding the 17 indexes. Both passed ddl-auto=validate. Schema changes are now SQL files reviewed in pull requests, and the current production state is traceable through Git history.",
      },
      {
        issue:
          "An incident email at 3 AM was useless if I wasn't at my computer — I wanted to direct a fix from my phone, from code change through deploy confirmation, without being physically present.",
        analysis:
          "My first instinct — SSH plus a persistent tmux session — collided with this server's deploy pipeline (cd.yml), which keeps port 22 closed by default and only opens it to the GitHub Actions runner's IP for the duration of a deploy. Leaving SSH open around the clock for phone access would have broken that security model outright. There was also a structural trap: the deploy directory (/app/repo) gets overwritten by git reset --hard on every deploy, so if a server-resident AI edited files directly without pushing them, the next deploy would silently wipe the fix.",
        solution:
          "I switched to Claude Code's /remote-control feature. Unlike SSH, where the client connects inbound to the server, the server-side Claude Code process keeps an outbound connection to Anthropic open, and the phone connects the same way and gets relayed through — no inbound port ever opens. I withheld deploy rights from it: it can commit and git push, nothing further, so the fix flows through the already-verified CD pipeline's build, health check, and rollback safeguards instead of a new, unproven path. tmux plus systemd means the session survives a server reboot automatically, and ~/.claude/settings.json splits permissions into allow (git operations, read-only checks), ask (deletion, sudo, service restarts), and deny (destructive commands) so the auto-approved scope stays bounded even when I'm not watching closely. When I lost the SSH private key partway through setup and couldn't reach the server at all, I didn't cut a new backdoor — I reused the SSH secrets the CD pipeline already held, via a workflow_dispatch workflow, to build an install/diagnose channel instead.",
        result:
          "The system got tested for real almost immediately: a 502 appeared right after resizing the instance. I initially suspected the resize, but the deploy history showed the previous deploy had already died on a failed health check before the resize even started — and on top of that, cd.yml's failure-log step was printing logs for the wrong container name (app-app-1 instead of the actual crossview-app), so the crash logs had never once been visible. Chasing the deploy history and the logging bug instead of trusting the obvious-looking cause led to the real one — t3.micro's CPU credit limits plus a health-check timeout — and only then did redeploys start succeeding again, with the remote-ops setup proving itself in production on day one.",
      },
    ],
    retrospective: {
      improvements:
        "The first half of this project taught me how to balance operational cost against reliability — dropping RDS and designing AI cost controls both came from asking 'what is the right level for this service's scale?' In the second half my attention moved inward. With everything working, I re-read the code asking whether it would hold up under load, and that surfaced the capacity race condition, a member-count query pattern that repeated itself, and schema changes with no history. All of them were the kind that run fine today and break when conditions change — and none would ever show up in a feature test. So I made a rule of writing the reproduction test before the fix, and for the concurrency bug I deliberately reverted the fix afterward to confirm the test failed. That was when it clicked that a test passing matters less than whether it fails when the code is wrong.",
      regrets:
        "Monitoring is still skewed toward error alerting; performance metrics (response times, query latency) remain thin. I added Prometheus and Grafana, but the dashboards are mostly system-level, so the very problems I just fixed — N+1 patterns, lock waits — are not yet observable as metrics. I also validated the performance work only by query count, never by putting real load on the system to see how response times actually change. Pessimistic locking is a safe choice at this scale, but I have no data on how contention builds when requests pile onto a popular group.",
      futureWork:
        "Build k6 load-test scenarios to measure before/after in response time and throughput, and surface lock wait time and connection pool utilization on the Grafana dashboard. Automate backup recovery testing so the 24-hour RPO is verified rather than assumed. On the code side, I am considering extending domain events beyond notifications — replacing the current approach where a service deletes a group's child data in a fixed order with an event-driven one.",
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
