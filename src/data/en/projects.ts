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
        "My first instinct was to use RDS — it's the obvious choice. But even the smallest instance, once storage and backup costs were added on top, rivaled the EC2 bill itself. I asked myself: 'Does this service actually need RDS-level availability?' Honestly, for a study platform with a few dozen users, Multi-AZ failover was overkill. So I put PostgreSQL in Docker on EC2 and covered the data loss risk with daily S3 backups. An RPO of 24 hours means 'worst case, I lose one day of data' — and for this service, that's an acceptable tradeoff. For error alerting, I originally planned to just collect logs and email them. But after waking up to error emails at 3 AM and having to judge 'is this urgent or not?' every single time, it got exhausting. So I plugged in Bedrock Claude — but to keep costs predictable, I chose the cheapest Haiku model, capped context at 50 recent log lines, and added a 10-minute dedup cooldown for identical errors. The principle was: 'use AI, but never let the cost become unpredictable.'",
    },
    techStack: [
      {
        name: "Spring Boot / JPA / QueryDSL",
        role: "REST API, domain logic, dynamic queries",
      },
      {
        name: "Docker Compose + PostgreSQL",
        role: "Application runtime + data storage",
      },
      {
        name: "Spring Batch + S3",
        role: "Daily DB backup automation",
      },
      {
        name: "Bedrock Claude Haiku + Logback",
        role: "Automated error analysis and alerting",
      },
      {
        name: "Terraform",
        role: "Full AWS infrastructure as code",
      },
      {
        name: "Flyway",
        role: "Database schema version control",
      },
      {
        name: "Claude Code (Remote Control)",
        role: "AI agent resident on the server for remote ops",
      },
    ],
    problemSolving: [
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
          "An incident email at 3 AM was useless if I wasn't at my computer — I wanted to direct a fix from my phone, from code change through deploy confirmation, without being physically present.",
        analysis:
          "My first instinct — SSH plus a persistent tmux session — collided with this server's deploy pipeline (cd.yml), which keeps port 22 closed by default and only opens it to the GitHub Actions runner's IP for the duration of a deploy. Leaving SSH open around the clock for phone access would have broken that security model outright. There was also a structural trap: the deploy directory (/app/repo) gets overwritten by git reset --hard on every deploy, so if a server-resident AI edited files directly without pushing them, the next deploy would silently wipe the fix.",
        solution:
          "I switched to Claude Code's /remote-control feature. Unlike SSH, where the client connects inbound to the server, the server-side Claude Code process keeps an outbound connection to Anthropic open, and the phone connects the same way and gets relayed through — no inbound port ever opens. I withheld deploy rights from it: it can commit and git push, nothing further, so the fix flows through the already-verified CD pipeline's build, health check, and rollback safeguards instead of a new, unproven path. tmux plus systemd means the session survives a server reboot automatically, and ~/.claude/settings.json splits permissions into allow (git operations, read-only checks), ask (deletion, sudo, service restarts), and deny (destructive commands) so the auto-approved scope stays bounded even when I'm not watching closely. The install and diagnostic channel followed the same rule: rather than opening a new path, I reused the secrets the CD pipeline already held via a workflow_dispatch workflow.",
        result:
          "The system got tested for real almost immediately: a 502 appeared right after resizing the instance. I initially suspected the resize, but the deploy history showed the previous deploy had already died on a failed health check before the resize even started — and on top of that, cd.yml's failure-log step was printing logs for the wrong container name (app-app-1 instead of the actual crossview-app), so the crash logs had never once been visible. Chasing the deploy history and the logging bug instead of trusting the obvious-looking cause led to the real one — t3.micro's CPU credit limits plus a health-check timeout — and only then did redeploys start succeeding again, with the remote-ops setup proving itself in production on day one.",
      },
    ],
    retrospective:
      "Essentially all of the code in this project was written by AI. So the question I carried through development wasn't how fast I could ship — it was what I would trust code I didn't write. The answer turned out to be tests. If I pinned down what had to hold before handing off the implementation, I could verify the behavior regardless of who wrote the code.\n\nSo I treated testing as a question of which layer verifies what, not how many tests I could write. Domain rules — anything decidable from collaborating objects alone — stayed in fast unit tests with mocks. Anything where infrastructure changes the outcome, like which queries the database actually issues or whether a lock actually engages, moved into integration tests against a real PostgreSQL. The criterion was simple: does the thing I'm trying to verify disappear the moment I swap in a mock? If it does, it doesn't belong in a unit test.\n\nConcurrency was exactly that case. I wrote the reproduction test first — 10 people joining a 2-person group simultaneously — watched all 10 succeed, and only then added the lock. After fixing it, I deliberately removed the lock again to confirm the test failed with expected 1, actual 10. That was when it clicked that a test passing matters less than whether it fails reliably when the code is wrong. Race conditions can't be reproduced with mocks at all, and an ordinary transactional test that rolls back at the end can't spin up concurrent transactions either, so those moved into integration tests with a real database and real threads. I handled the N+1 the same way: the assertion had to be 'the aggregate query stays at exactly one regardless of how many groups are on the page,' not a vague sense that things felt slow — otherwise nothing catches the regression.\n\nWhat became just as clear is that directing AI well required me to know the domain and the features precisely. That 'member count <= capacity' isn't a condition a database can enforce the way a unique constraint can, so the application has to guarantee it. That counting members one way works for a detail view — a single COUNT — but doing the same thing in a list view creates another N+1. That isn't the kind of knowledge a code generator hands you. I had to understand the problem to ask the right question, and I had to know what needed verifying to decide which layer a test belonged in. Domain understanding was the input to test design, and those tests were what made AI-written code trustworthy. The suite grew to 50 along the way, but what stayed with me was the ordering, not the count. The more I built with AI, the more domain understanding and test design turned out to matter.\n\nThe blind spots are just as real. Monitoring is skewed toward error alerting, so performance signals like response time and query latency are thin. I validated the performance work only by query count, never by putting real load on the system. Pessimistic locking is safe at this scale, but I have no data on how contention builds when requests pile onto a popular group. The gap between what I can say I fixed and what I actually measured still sits with me.",
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
        "Built to eliminate the inefficiency of cybersecurity engineers manually searching through ISO/SAE 21434, UN R155, and internal TARA tables for every query. I structured it so the TARA automation tool (tAIRA) calls this system at each analysis step to pull in grounding context.",
      role:
        "Solely designed and implemented the entire RAG pipeline — from embedding model selection to retrieval strategy, LLM answer generation, and API integration. The core of the work was refusing to stop at 'it seems to work': I built an evaluation set from real analyst questions and narrowed down which query types were failing, and why, using metrics.",
    },
    architecture: {
      diagram: "/images/rag_arch.svg",
      description:
        "A query is embedded as dense+sparse via BGE-M3, retrieved via FAISS, scores combined at 0.7/0.3, reranked by a cross-encoder, and the top 5 chunks are passed as grounding to Ollama for Korean answer generation. The index covers ISO/SAE 21434, UN R155, and TARA tables chunked at 1,200 characters with 150 overlap — 1,680 chunks total — embedded offline with incremental indexing.",
      reasoning:
        "I initially assumed dense search alone would suffice, but queries like 'What is threat M013-1?' returned irrelevant results — semantic embeddings can't distinguish meaningless identifier codes. So I switched to a hybrid approach, and BGE-M3 conveniently produces both dense and sparse vectors in a single encoding, keeping the pipeline simple. The cross-encoder dramatically improved relevance but was too slow to apply to everything, so I limited it to the top 20 hybrid candidates — a tradeoff between accuracy and latency. I also refused to trust the reranker alone for the final ordering, blending it as 0.7×rerank + 0.3×hybrid so the first-stage signal survives. The generation model runs locally via Ollama, and the judge model that scores answer quality is deliberately a different model from the generator.",
    },
    techStack: [
      {
        name: "BGE-M3",
        role: "Dense + sparse embeddings",
      },
      {
        name: "FAISS",
        role: "Vector index / candidate retrieval",
      },
      {
        name: "Cross-Encoder Reranker",
        role: "Candidate reranking",
      },
      {
        name: "Ollama (qwen2.5)",
        role: "Korean answer generation / evaluation judge",
      },
      {
        name: "FastAPI",
        role: "Query API / tAIRA integration",
      },
      {
        name: "Docker Compose",
        role: "Deployment / data separation",
      },
    ],
    problemSolving: [
      {
        issue:
          "Overall accuracy looked fine, yet certain queries kept missing — and there was no way to tell which type by intuition. So I first built a 31-question evaluation set from real analyst questions and swept k = 1/3/5/10 to split the scores by category.",
        analysis:
          "Split apart, the failures were concentrated in queries that quoted a threat ID or clause number verbatim — 'M013-1', '[RQ-09-01]'. Only 5 of those 10 questions surfaced the correct item at rank 1, and their MRR (0.628) sat below the average of the remaining questions (0.738). Dense embeddings couldn't separate a meaningless code from general vocabulary, and the reranker made it worse by splitting identifiers into subwords, weakening the very exact match that mattered.",
        solution:
          "Combined dense (0.7) + sparse (0.3) scores to reinforce exact token matching, and added a branch: when an ID pattern is detected, bypass the reranker, force chunks containing that ID into the candidate set, and boost the score when the identifier appears verbatim in the source. The key insight was abandoning the assumption that all queries should go through the same pipeline.",
        result:
          "Re-run against the same evaluation set, queries answered correctly at rank 1 went from 18 to 21, MRR from 0.703 to 0.785, and nDCG@5 from 0.604 to 0.707. Hit rate within the top 5 barely moved — because the problem was never 'not finding it,' it was 'ranking it too low.' Without deciding in advance which metric the improvement should show up in, this change would have been invisible.",
      },
      {
        issue:
          "With 2+ concurrent queries, later requests stalled until the first finished — embedding, FAISS, reranker, and Ollama calls are all synchronous blocking.",
        analysis:
          "FastAPI is async, but inference libraries are synchronous. Calling them directly inside async functions blocks the entire event loop.",
        solution:
          "Delegated all blocking calls to a thread pool via asyncio.to_thread, then split the concurrency limit by workload — 4 for retrieval, 2 for generation. The draft had them behind a single semaphore, but retrieval is light and generation is heavy, and sharing one limit makes cheap retrievals queue behind expensive inference. I also designed tAIRA integration to gracefully degrade with empty context on RAG failure — RAG is an auxiliary tool and should never block tAIRA's core analysis flow.",
        result:
          "Event-loop blocking under concurrent queries disappeared, and tAIRA's TARA analysis continues uninterrupted even when RAG fails. Latency at k=5 measured 369ms mean / 303ms p50 / 455ms p95, and the measurement also showed that first-call warm-up dominates the cost.",
      },
    ],
    retrospective:
      "The company is an automotive cybersecurity consultancy, not a software organization, so I built this system alone from scoping through deployment. Writing a RAG pipeline with no one to review the code and no one to argue the design with was the real constraint. I worked with AI as a pair programmer and filled the missing reviewer's seat with test code instead.\n\nI pinned down tests for how retrieval shifts when the chunk size changes, whether identifier queries actually route into the hybrid branch, and whether concurrent requests ever cross responses — and once implementation was handed off, I ran the tests first, every time. When nobody else is reading your code, what you have already verified is the only reason to trust it.\n\nSo the first thing I built was not a feature but the evaluation set. Thirty-one real questions with their correct documents attached, scored on Precision@5, MRR, nDCG, and Hit@k across k values, so every parameter change could be confirmed as an improvement or a regression in numbers rather than intuition. Having metrics did not hand me the interpretation, though. Recall@5 came out at 0.25, which was not a performance problem but a definitional one — several chunks are relevant to a single gold answer and k=5 cuts them off, and at k=10 it becomes 0.42. Deciding which metric to treat as primary turned out to be part of designing the evaluation, not something the numbers decide for you.\n\nAt the same time, the limits of what AI could do for me were obvious. Why dense embeddings alone can't retrieve an identifier like M013-1, why the cross-encoder had to be capped at the top 20 rather than applied to everything — those calls were only available to me because I understood the problem. AI turned my decisions into code quickly; it never made the decisions. Building at this scale alone was possible because of AI, but what made it actually run was leaving a reason and a test behind every choice.",
    links: {},
  },
  {
    category: "infrastructure",
    title: "EKS · Central VPC Infrastructure",
    period: "Feb 2026",
    overview: {
      description:
        "Started from the desire to design a Kubernetes platform that could actually handle production-level traffic. Built an EKS-based application platform and Central VPC centralized operations network, then validated the architecture with 1,700 RPS and 100K total requests in QA.",
      role: "As team lead, coordinated the schedule and direction while driving the EKS-centric architecture design. My focus was on predicting 'where will it break first under load?' and preparing for it proactively.",
    },
    architecture: {
      diagram: "/images/aws_cj_infra.png",
      description:
        "Five environments were designed — Prod / QA / Dev / DR / Central VPC — and QA was built out as the live cluster, running CloudFront → ALB (Ingress) → Service → Pod across multiple AZs. Prod was taken as far as a Terraform definition of the same topology. The data layer uses Aurora + RDS Proxy, and the Central VPC consolidates GitLab, the monitoring stack, and DNS security observability, connected to each environment through a Transit Gateway hub-and-spoke.",
      reasoning:
        "I considered ECS but wanted fine-grained autoscaling control via open-source tools like KEDA and Karpenter, plus consistent Helm-based config management across environments — so EKS was the better fit. Central VPC wasn't in the original design; I added it after realizing that setting up monitoring separately per environment scattered alerts and made it impossible to see the whole picture. DR used Pilot Light because Active-Active was beyond budget — maintaining minimal resources in standby and scaling up on failure was the cost-recovery tradeoff.",
    },
    techStack: [
      {
        name: "Terraform",
        role: "Infrastructure provisioning and DR reproducibility",
      },
      {
        name: "AWS EKS",
        role: "Application execution / orchestration",
      },
      {
        name: "KEDA",
        role: "Request-based Pod autoscaling",
      },
      {
        name: "Karpenter",
        role: "Node-level autoscaling",
      },
      {
        name: "ArgoCD / GitOps",
        role: "Declarative deployment state",
      },
      {
        name: "IRSA",
        role: "Per-Pod AWS permission isolation",
      },
    ],
    problemSolving: [
      {
        issue:
          "Requests to the ALB came back 404, even though the Pods were Running with no sign of having died.",
        analysis:
          "The ALB health check path was set to '/', and Spring doesn't return 200 there — so the ALB was marking perfectly healthy Pods as dead targets. The same root cause had a second symptom: Spring Boot takes 10–15 seconds to boot, and without separated probes, traffic reaches Pods that aren't ready yet. Kubernetes and the ALB were reading two different definitions of 'ready.'",
        solution:
          "Separated startup, readiness, and liveness probes — startup allows 5s × 60 attempts, guaranteeing up to 300 seconds of boot time — and pointed the ALB health check at the same readiness endpoint so both layers judge by one standard. Scaling moved to per-Pod request count via KEDA, and because an event opening is a vertical spike that can't wait on scheduling and JVM warm-up, 45 Pods are pre-provisioned as the first line of defense with KEDA and Karpenter as the second. Scale-down uses a 600-second cooldown, deliberately asymmetric against how fast it scales up.",
        result:
          "Sustained ~1,700 RPS for 60 seconds in QA, processing 100,000 requests with zero downtime. That said, starting at min 45 meant the scale-out path itself never got its own test scenario — I would run a separate ramp-up test from a lower minimum if I did it again.",
      },
      {
        issue:
          "Worker nodes failed to join the EKS API or fell into NotReady state.",
        analysis:
          "I initially assumed it was a node-level issue, but the actual cause was that Private Subnet routing tables weren't going through the NAT Gateway, so nodes couldn't reach the control plane. A network configuration error, not a compute one.",
        solution:
          "I suspected IAM first, but WorkerNodePolicy was already attached — and a permissions problem would show the node joining and then going NotReady, not disappearing entirely. So I moved down to the network layer, confirmed the NAT Gateway placement, then found and fixed the wrong route in the routing table. The same symptom later reappeared in a new environment from a missing DNS setting: the API endpoint failed to resolve, so kubelet couldn't reach the control plane at all. After this I wrote an EKS network checklist so new environments get checked in that same order.",
        result:
          "Node join was resolved, and more usefully I came away with an ordering — narrow by which layer the path broke at, not by what the symptom looks like.",
      },
      {
        issue:
          "Monitoring agent and ArgoCD Pods sat in Pending even though the node had CPU and memory to spare.",
        analysis:
          "Opening Allocatable alongside the non-terminated Pod list showed the shortage wasn't compute — it was Pod slots. The VPC CNI assigns Pod IPs from ENIs, and on that instance type the per-node Pod ceiling was capped at 17. I had been thinking about capacity purely in terms of CPU and memory.",
        solution:
          "I first reclaimed slots by clearing unused Pods, then disabled the ENI-based auto-calculation via a bootstrap option so kubelet's own default applied, lifting the ceiling. That only raises the kubelet limit, though — the VPC CNI still supplies the actual IPs, so the ENI constraint remains. The real fix is prefix delegation to raise IP density; at the time securing slots was urgent, so the bootstrap option came first.",
        result:
          "Pending cleared, and I learned to read node capacity as what's left for the application after DaemonSets and system components, not as the instance's spec sheet.",
      },
    ],
    retrospective:
      "The biggest takeaway was validating a designed architecture against real load. Architecture on paper and architecture under traffic are different things, and I felt that difference firsthand.\n\nWhat stayed with me longer, though, was how to work with AI. Terraform modules, KEDA ScaledObjects, Karpenter NodePools — drafting all of it went noticeably faster with AI. But what got faster was implementation, not judgment. If I couldn't explain why KEDA instead of HPA, or Karpenter instead of Cluster Autoscaler, the generated config was just YAML that happened to run. I once set scaling values without properly reasoning through the policy and blew past the AWS budget during load testing. That wasn't the tool's failure; it was mine for directing it without criteria.\n\nSo I reversed the order: settle why this technology first, then bring AI in for the stretch that turns the decision into code. The same tool behaved completely differently after that. It stopped being 'something I could only manage because AI existed' and became 'more configurations I could validate in the same amount of time.' The clearer my reasons for a technology choice, the more AI was worth — that was this project's conclusion. Not getting Karpenter fully into the GitOps flow before the project wrapped still sits with me as unfinished.",
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
        "Every request for a portfolio PDF meant reworking a document by hand, so for the convenience of everyone involved I decided to build a site that serves the portfolio on the web and auto-generates the PDF. Since I was building it anyway, I set a goal of handling everything solo — frontend to infrastructure to CI/CD.",
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
        name: "AWS S3 + CloudFront + OAC",
        role: "Static file storage / global CDN",
      },
      {
        name: "AWS Lambda + Puppeteer (Container)",
        role: "Serverless PDF generation",
      },
      {
        name: "AWS API Gateway",
        role: "HTTP endpoint for Lambda",
      },
      {
        name: "Amazon EventBridge + SES",
        role: "Feedback event processing / email",
      },
      {
        name: "Terraform",
        role: "Full infrastructure IaC",
      },
      {
        name: "GitHub Actions",
        role: "Frontend / Lambda deployment automation",
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
    retrospective:
      "What stayed with me most is how completely different 'working' and 'operable' turn out to be. Getting the static site onto S3 and rendering was quick; the WAF, X-Ray, and CloudWatch alarms I added afterward took far longer. Not a single feature came out of that work, and I kept wondering why I was still on it — until an alarm told me a deploy had broken before any visitor noticed. Observability and defense aren't nice-to-haves; they're closer to the precondition for operating anything at all.\n\nTerraform started as one file holding everything. As resources piled up I lost track of what changed when I touched one thing, and only then did I split it into role-based modules — acm, s3, cloudfront, lambda, waf. Would it have been better to structure it that way from the start? I don't think so. I could only explain my own criteria for splitting modules after living through a file that had outgrown itself.\n\nGenerating the PDF on the server came from the same place. Browser printing produces a PDF, but only after the user has matched up margins and background options in the print dialog themselves. I once needed to send one from my phone in a hurry and the file that came out didn't match what I'd produced on my laptop — and for a résumé-style document, it should be the same file no matter who downloads it or where. The only way to get there was moving rendering from the client to the server, which is why Lambda and Puppeteer are in this project. It wasn't about adding a feature; it was about collapsing the output to one result.\n\nThe price of that choice is cold start. The first request takes close to 10 seconds, and I know Provisioned Concurrency would fix it. But do I pay a standing cost on a site with almost no traffic, or let the occasional first visitor wait 10 seconds? I haven't settled that with myself yet. This smallest of my projects was where I first ran into cost and user experience colliding head-on with no clean answer.",
    links: {
      github: "https://github.com/eomkyeongmun/my-portfolio",
      velog: "https://velog.io/@eomkyeongmun/series/project",
    },
  },
];
