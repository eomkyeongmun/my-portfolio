# 개인 포트폴리오 AWS 서버리스 아키텍처

이 프로젝트는 서버리스(Serverless) 아키텍처를 기반으로 구축되어, 운영 비용을 최소화하면서도 글로벌 전송 속도와 보안을 갖추도록 설계되었습니다.

## 🗺️ 시스템 아키텍처 다이어그램

```mermaid
graph TD
    User((👩‍💻 사용자)) -->|1. 웹 포트폴리오 접속| CF[🌐 Amazon CloudFront]
    User -->|2. PDF 이력서 다운로드| API[🚪 Amazon API Gateway]
    User -->|3. 피드백 폼 제출| API

    subgraph "🌍 Frontend (Static Hosting)"
        CF -->|정적 리소스 접근 (OAC)| S3[🪣 Amazon S3\n(Next.js 빌드 파일)]
        WAF[🛡️ AWS WAF] -.->|악성 요청 필터링| CF
        ACM[인증서 관리] -.->|HTTPS 암호화| CF
    end

    subgraph "⚙️ Backend (PDF Generation API)"
        API -->|GET /api/pdf/{slug}| LambdaPDF[⚡ AWS Lambda\n(pdf-generator\nPuppeteer 컨테이너)]
        LambdaPDF -.->|컨테이너 이미지 Pull| ECR[📦 Amazon ECR]
        LambdaPDF -->|헤드리스 크롬으로 사이트 렌더링| CF
    end

    subgraph "📬 Feedback System"
        API -->|POST /api/feedback| LambdaFB[⚡ AWS Lambda\n(feedback-handler\nNode.js zip)]
        LambdaFB -->|PutEvents| EB[🔀 EventBridge\nportfolio-events 버스]
        EB -->|Rule: source=portfolio.feedback| LambdaEM[⚡ AWS Lambda\n(email-sender\nNode.js zip)]
        LambdaEM -->|SendEmail| SES[📧 Amazon SES\nnoreply@eomkyeongmun.me]
        SES -->|이메일 수신| Inbox[📥 eomkyeongmun@naver.com]
    end

    subgraph "👁️ Observability (분산 추적 시스템)"
        XRay((📡 AWS X-Ray))
        CW[☁️ CloudWatch\n대시보드 / 알람]
        SNS[🔔 SNS\n알람 토픽]
        API -.->|총 응답 시간 및 상태코드 추적| XRay
        LambdaPDF -.->|Puppeteer 렌더링 세부 지연 시간 기록| XRay
        CW -->|임계값 초과 알람| SNS
        SNS -->|이메일 알림| Inbox
    end

    subgraph "🚀 CI/CD 인프라 자동화"
        GH[GitHub Actions] -.->|main 브랜치 Push 시 자동 배포| S3
        GH -.->|최신 컨테이너 이미지 업데이트| ECR
        GH -.->|Lambda 이미지 업데이트| LambdaPDF
    end

    classDef aws fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:white;
    classDef monitor fill:#FF4F8B,stroke:#232F3E,stroke-width:2px,color:white;
    classDef feedback fill:#059669,stroke:#065f46,stroke-width:2px,color:white;

    class XRay monitor;
    class LambdaFB,LambdaEM,EB,SES feedback;
```

---

## 🧩 아키텍처 구성 요소 상세 설명

### 1. 프론트엔드 (정적 웹 호스팅)
- **Amazon S3**: Next.js 프로젝트를 정적으로 빌드(Static Export)한 결과물(`.html`, `.css`, `.js`)을 보관하는 원본 저장소입니다. 퍼블릭 접근을 차단하여 보안을 강화했습니다.
- **Amazon CloudFront**: S3에 저장된 콘텐츠를 전 세계 엣지 로케이션에 캐싱하여 빠른 응답 속도를 제공하는 CDN 서비스입니다. `OAC (Origin Access Control)`를 통해 CloudFront에서만 S3에 접근할 수 있도록 보안을 설정했습니다.
- **AWS WAF & ACM**: WAF(웹 방화벽)를 적용하여 SQL 인젝션, 악성 봇 등의 비정상적인 접근을 방어하고, ACM을 통해 발급받은 SSL/TLS 인증서로 모든 통신을 HTTPS로 안전하게 보호합니다.

### 2. 백엔드 (서버리스 PDF 생성 서비스)
- **Amazon API Gateway**: 프론트엔드에서 넘어오는 `GET /api/pdf/{slug}` 요청을 수신하여 람다 함수로 전달하는 진입점 역할을 합니다.
- **AWS Lambda & ECR**: 무거운 백엔드 서버를 24시간 켜두는 대신, 요청이 들어올 때만 실행되는 서버리스 컴퓨팅 환경을 구축했습니다. ECR에 저장된 Docker 컨테이너 이미지(Puppeteer 내장)를 기반으로 구동되며, 가상의 크롬 브라우저를 띄워 포트폴리오를 PDF로 캡처 후 반환합니다.

### 3. 모니터링 및 관측성 향상 (AWS X-Ray 도입)
- **분산 시스템 추적 (AWS X-Ray)**: API Gateway부터 Lambda 실행 런타임 구간을 모두 추적하도록 구성했습니다.
- 특히 Lambda가 구동될 때 발생하는 **콜드 스타트(Cold Start)** 시간과, 내부에서 Puppeteer 브라우저가 **DOM 요소를 렌더링하는 데 걸리는 시간(병목 지점)**을 엑스레이 트레이스 상에서 명확하게 시각화하여 분석하고 관리할 수 있도록 인프라를 한 단계 고도화했습니다.
