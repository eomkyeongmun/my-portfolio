# 🗂️ 엄경문 개인 포트폴리오

> **AI 기술을 실제 인프라와 서비스로 연결하는 사람이 되겠습니다.**

한국어/영어 이중 언어 개인 포트폴리오 웹사이트입니다. 단순한 정적 페이지가 아니라, **서버리스 아키텍처**와 **IaC(Infrastructure as Code)** 기반으로 설계된 풀스택 프로젝트입니다.

[![Deploy](https://github.com/Kyeongmun-Eom/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Kyeongmun-Eom/my-portfolio/actions/workflows/deploy.yml)

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🌏 **이중 언어** | 한국어 / 영어 전환 (현재 페이지 유지) |
| 🌙 **다크 모드** | 시스템 설정 반영, 수동 토글 지원 |
| 📄 **PDF 다운로드** | Lambda + Puppeteer로 서버사이드 PDF 생성 |
| 💬 **피드백 폼** | 방문자 메시지 → EventBridge → SES 이메일 수신 |
| 🔒 **보안 강화** | AWS WAF, HTTPS(ACM), CloudFront OAC 적용 |
| 📊 **분산 트레이싱** | AWS X-Ray로 Lambda 요청 추적 |

---

## 🏗️ 인프라 아키텍처

```
                        ┌──────────────────────────────────────────┐
                        │           사용자 브라우저                   │
                        └──────────────────┬───────────────────────┘
                                           │ HTTPS
                                           ▼
                        ┌──────────────────────────────────────────┐
                        │           AWS CloudFront (CDN)            │
                        │   ├─ AWS WAF (악성 요청 차단)               │
                        │   ├─ ACM (TLS/SSL 인증서)                  │
                        │   └─ OAC (S3 버킷 직접 접근 차단)           │
                        └──────────┬────────────────┬──────────────┘
                                   │                 │
                    정적 파일 요청   │                 │  API 요청
                                   ▼                 ▼
                        ┌──────────────┐   ┌──────────────────────┐
                        │   Amazon S3   │   │  API Gateway v2      │
                        │  (정적 호스팅) │   │  (HTTP API)          │
                        │  Next.js 빌드 │   │  ├─ GET /api/pdf/:slug│
                        └──────────────┘   │  └─ POST /api/feedback│
                                           └──────────┬───────────┘
                                                      │
                               ┌──────────────────────┴──────────────────────┐
                               │                                              │
                               ▼                                              ▼
               ┌───────────────────────────┐          ┌────────────────────────────┐
               │    PDF 생성 Lambda         │          │    피드백 수신 Lambda        │
               │  (ECR Container Image)    │          │                            │
               │  ├─ @sparticuz/chromium   │          │  ├─ 입력 유효성 검사         │
               │  ├─ Puppeteer             │          │  ├─ XSS 방어               │
               │  ├─ Noto Sans KR 폰트     │          │  └─ EventBridge 발행        │
               │  └─ AWS X-Ray 트레이싱     │          └──────────────┬─────────────┘
               └───────────────────────────┘                         │
                                                                      ▼
                                                       ┌──────────────────────────┐
                                                       │   Amazon EventBridge      │
                                                       │   (이벤트 버스)             │
                                                       └──────────────┬───────────┘
                                                                      │
                                                                      ▼
                                                       ┌──────────────────────────┐
                                                       │    이메일 발송 Lambda       │
                                                       │  └─ Amazon SES           │
                                                       │     (이메일 수신 알림)       │
                                                       └──────────────────────────┘
```

### 인프라 구성 요소

| AWS 서비스 | 역할 |
|-----------|------|
| **S3** | Next.js 정적 빌드 파일 호스팅 |
| **CloudFront** | 글로벌 CDN, 캐싱, HTTPS 종단점 |
| **ACM** | TLS/SSL 인증서 (us-east-1) |
| **AWS WAF** | 악성 트래픽 필터링 (CloudFront 스코프) |
| **API Gateway v2** | HTTP API 라우팅 (Lambda Proxy) |
| **Lambda (x3)** | PDF 생성 / 피드백 수신 / 이메일 발송 |
| **ECR** | Lambda 컨테이너 이미지 레지스트리 |
| **EventBridge** | 피드백 이벤트 파이프라인 |
| **SES** | 피드백 이메일 수신 알림 |
| **CloudWatch** | 로그 수집 및 메트릭 모니터링 |
| **AWS X-Ray** | Lambda 분산 트레이싱 |
| **Route53** | DNS 레코드 관리 |
| **IAM** | 최소 권한 역할/정책 |

---

## 📄 PDF 생성 흐름

```
사용자 클릭 [PDF 다운로드]
       ↓
PdfDownloadButton.tsx
       ↓  GET /api/pdf/{slug}
API Gateway v2
       ↓  Lambda Proxy
PDF 생성 Lambda (ECR)
  ├─ @sparticuz/chromium 실행
  ├─ CloudFront URL로 /portfolio/print/{slug} 접근
  ├─ 폰트(Noto Sans KR) 로딩 완료 대기
  ├─ A4 PDF 렌더링
  └─ base64 인코딩 반환
       ↓
브라우저: Blob URL → PDF 자동 다운로드
```

> 한글 깨짐 방지를 위해 Lambda 컨테이너에 Noto Sans KR OTF 폰트를 직접 포함합니다.

---

## 🔄 CI/CD 파이프라인

```
git push → main
       ↓
GitHub Actions (.github/workflows/deploy.yml)
  ├─ [test] ESLint + Next.js 빌드 검증
  ├─ [build-and-deploy-static]
  │     ├─ Next.js 정적 빌드 (NEXT_PUBLIC_* 환경변수 주입)
  │     ├─ S3 업로드
  │     │     ├─ _next/static/ → Cache-Control: immutable (1년)
  │     │     └─ 기타 파일 → Cache-Control: must-revalidate
  │     └─ CloudFront 캐시 무효화
  └─ [build-and-deploy-lambda]
        ├─ Docker 이미지 빌드 (git SHA 태깅)
        ├─ ECR 푸시
        └─ Lambda 함수 이미지 업데이트
```

---

## 🛠️ 기술 스택

### 프론트엔드

| 기술 | 버전 | 역할 |
|------|------|------|
| **Next.js** | 16.2 | App Router, 정적 익스포트 |
| **React** | 19 | UI 렌더링 |
| **TypeScript** | 5 | 타입 안전성 |
| **Tailwind CSS** | v4 | CSS-first 유틸리티 스타일링 |
| **Geist** | - | 영문 폰트 (next/font/google) |
| **Noto Sans KR** | - | 한글 폰트 (웹폰트 + PDF 임베드) |

### 백엔드 / 인프라

| 기술 | 역할 |
|------|------|
| **Puppeteer** | Headless Chrome PDF 렌더링 |
| **@sparticuz/chromium** | Lambda용 경량 Chromium 바이너리 |
| **Terraform** | 인프라 코드화 (IaC) |
| **Docker** | Lambda 컨테이너 이미지 빌드 |
| **GitHub Actions** | CI/CD 자동화 |

---

## 📁 프로젝트 구조

```
my-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 한국어 홈
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── contact/            # 연락처 페이지
│   │   ├── en/                 # 영어 라우트 (/en/*)
│   │   │   ├── page.tsx        # 영어 홈
│   │   │   ├── projects/       # 프로젝트 상세 (영어)
│   │   │   └── portfolio/print/# 영어 이력서 PDF 페이지
│   │   └── portfolio/print/    # 한국어 이력서 PDF 페이지
│   ├── components/             # 공통 UI 컴포넌트
│   │   ├── Header.tsx          # 네비게이션 (언어·테마·PDF 드롭다운)
│   │   ├── PdfDownloadButton.tsx # Lambda 호출 PDF 다운로드
│   │   ├── FeedbackForm.tsx    # 방문자 피드백 폼
│   │   ├── ThemeProvider.tsx   # 다크/라이트 모드
│   │   └── LangSetter.tsx      # 언어 감지 및 설정
│   └── data/                   # 포트폴리오 콘텐츠 (TypeScript 상수)
│       ├── profile.ts          # 인적사항, 학력, 경력
│       ├── skills.ts           # 기술 스택 및 숙련도
│       ├── projects.ts         # 프로젝트 목록
│       ├── highlights.ts       # 핵심 성과 (PAR 형식)
│       ├── certifications.ts   # 자격증
│       └── en/                 # 위 데이터의 영어 번역
├── lambda/                     # AWS Lambda 함수 소스
│   ├── handler.mjs             # PDF 생성
│   ├── feedback/handler.mjs    # 피드백 수신 및 EventBridge 발행
│   └── email/handler.mjs       # SES 이메일 발송
├── infra/                      # Terraform IaC
│   ├── main.tf                 # 루트 모듈
│   ├── modules/
│   │   ├── s3/                 # 정적 호스팅 버킷
│   │   ├── cloudfront/         # CDN 배포
│   │   ├── lambda/             # Lambda + ECR
│   │   ├── api-gateway/        # HTTP API v2
│   │   ├── feedback/           # EventBridge + SES
│   │   ├── iam/                # 역할/정책
│   │   ├── monitoring/         # CloudWatch + X-Ray
│   │   ├── waf/                # WAF 규칙
│   │   ├── acm/                # TLS 인증서
│   │   └── route53/            # DNS
│   └── bootstrap/              # Terraform 백엔드 초기화
├── Dockerfile                  # Lambda 컨테이너 이미지
├── .github/workflows/
│   └── deploy.yml              # CI/CD 파이프라인
└── CLAUDE.md                   # AI 어시스턴트 가이드
```

---

## 🚀 로컬 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
# NEXT_PUBLIC_PDF_API_URL, NEXT_PUBLIC_FEEDBACK_API_URL 설정
```

### 3. 개발 서버 실행

```bash
npm run dev
# → http://localhost:3000
```

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 린트

```bash
npm run lint
```

---

## ☁️ 배포 (Terraform)

```bash
cd infra

# 초기화
terraform init

# 변수 파일 준비
cp example.tfvars terraform.tfvars

# 인프라 프리뷰
terraform plan -var-file="terraform.tfvars"

# 인프라 생성
terraform apply -var-file="terraform.tfvars"
```

> **필요 권한**: S3, CloudFront, Lambda, ECR, API Gateway, EventBridge, SES, ACM, Route53, IAM, CloudWatch, WAF

---

## 🔐 GitHub Secrets 설정

CI/CD 파이프라인 실행을 위해 아래 시크릿을 GitHub 레포지터리에 등록합니다.

| Secret | 설명 |
|--------|------|
| `AWS_ACCESS_KEY_ID` | IAM 사용자 액세스 키 |
| `AWS_SECRET_ACCESS_KEY` | IAM 사용자 시크릿 키 |
| `AWS_REGION` | 배포 리전 (ap-northeast-2) |
| `S3_BUCKET_NAME` | 정적 파일 S3 버킷명 |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront 배포 ID |
| `ECR_REPOSITORY` | ECR 레포지터리 URI |
| `LAMBDA_FUNCTION_NAME` | PDF 생성 Lambda 함수명 |
| `PDF_API_URL` | API Gateway 엔드포인트 URL |
| `FEEDBACK_API_URL` | 피드백 API 엔드포인트 URL |

