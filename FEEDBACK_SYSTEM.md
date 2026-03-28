# 피드백 시스템 구현 기록

## 아키텍처

```
방문자 (FeedbackForm)
  │  POST /api/feedback
  ▼
API Gateway v2 (기존 pdf_api에 라우트 추가)
  │  AWS_PROXY
  ▼
Lambda: feedback-handler (Node.js 22.x)
  │  EventBridge.PutEvents → portfolio-events 버스
  ▼
EventBridge Rule (source = "portfolio.feedback")
  │
  ▼
Lambda: email-sender (Node.js 22.x)
  │  SES.SendEmail
  ▼
eomkyeongmun@naver.com
```

---

## 구현 완료

### Frontend
- [x] `src/components/FeedbackForm.tsx` — 이름(선택)/이메일(선택)/메시지(필수) 폼
- [x] `src/app/page.tsx` — 페이지 하단에 `<FeedbackForm />` 추가

### Lambda
- [x] `lambda/feedback/handler.mjs` — 입력 검증, XSS 이스케이프, EventBridge PutEvents
- [x] `lambda/email/handler.mjs` — SES SendEmail (텍스트 + HTML)

### Terraform
- [x] `infra/modules/feedback/main.tf` — IAM Role 2개, Lambda 2개, EventBridge 버스/룰/타깃, SES 도메인 설정
- [x] `infra/modules/feedback/variables.tf`
- [x] `infra/modules/feedback/outputs.tf` — SES 검증 토큰·DKIM 레코드 출력 포함
- [x] `infra/modules/api-gateway/main.tf` — CORS POST 추가, `POST /api/feedback` 라우트·통합·권한 추가
- [x] `infra/modules/api-gateway/variables.tf` — feedback Lambda ARN 변수 추가
- [x] `infra/main.tf` — `module "feedback"` 추가, `module "api_gateway"`에 feedback ARN 전달
- [x] `infra/variables.tf` — `feedback_email`, `sender_email` 변수 추가
- [x] `infra/terraform.tfvars` — 두 변수 값 추가
- [x] `infra/outputs.tf` — SES 검증 토큰·DKIM 출력 추가
- [x] `terraform apply` 완료

### DNS (외부 도메인, Route53 미사용)
- [x] TXT `_amazonses` → `JreO7pGgZky5vpffY/08MGNlwjDBU2a1s2PCm4MOUnk=`
- [x] CNAME `k23cqp7s3nrluki74sntkwtvnhg6slxd._domainkey` → `k23cqp7s3nrluki74sntkwtvnhg6slxd.dkim.amazonses.com`
- [x] CNAME `srq6tqqzzmopu5mo3bmsfaa4bqtoncso._domainkey` → `srq6tqqzzmopu5mo3bmsfaa4bqtoncso.dkim.amazonses.com`
- [x] CNAME `xisufhbi2ljmwkh4toag7asm7faqot2d._domainkey` → `xisufhbi2ljmwkh4toag7asm7faqot2d.dkim.amazonses.com`

---

## 진행 중 / 대기 중

### SES Production Access 요청
- [ ] AWS 콘솔 → SES → Account dashboard → Request production access
- 현재 Sandbox 상태 → naver.com 등 외부 수신 불가
- 승인 후에야 실제 이메일 수신 가능 (보통 수 시간 ~ 1영업일)
- 신청 내용:
  - Mail type: Transactional
  - Website URL: https://www.eomkyeongmun.me
  - Use case: 포트폴리오 방문자 피드백 알림, 하루 10건 미만

### SES 도메인 검증 확인
- [ ] AWS 콘솔 → SES → Verified identities → eomkyeongmun.me 상태 **Verified** 확인
- DNS 전파 후 자동 완료 (10~30분)

### 프론트엔드 환경변수
- [ ] `.env.local`에 추가:
  ```
  NEXT_PUBLIC_FEEDBACK_API_URL=https://bzajc2su6a.execute-api.ap-northeast-2.amazonaws.com
  ```
- [ ] 프로덕션 배포 환경(Vercel 등)에도 동일하게 설정

### 최종 테스트
- [ ] 폼 제출 → CloudWatch Lambda 로그 확인 (feedback-handler, email-sender)
- [ ] eomkyeongmun@naver.com 수신 확인

---

## 주요 리소스 정보

| 리소스 | 값 |
|--------|-----|
| API Gateway 엔드포인트 | `https://bzajc2su6a.execute-api.ap-northeast-2.amazonaws.com` |
| EventBridge 버스 | `portfolio-events` |
| SES 발신 주소 | `noreply@eomkyeongmun.me` |
| SES 수신 주소 | `eomkyeongmun@naver.com` |
| feedback-handler Lambda | `my-portfolio-feedback-handler-prod` |
| email-sender Lambda | `my-portfolio-email-sender-prod` |
