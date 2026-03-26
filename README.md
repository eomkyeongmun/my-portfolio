# my-portfolio

개인 포트폴리오 웹사이트. 웹 열람용 페이지와 PDF 다운로드 기능을 함께 제공합니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| 스타일 | Tailwind CSS v4 (CSS-first config) |
| 폰트 | Geist (영문), Noto Sans KR (한글) |
| PDF 생성 | Puppeteer |

## 프로젝트 구조

```
src/
  app/
    layout.tsx          # 루트 레이아웃 (폰트, 메타데이터)
    page.tsx            # 홈 페이지
    portfolio/
      page.tsx          # 포트폴리오 웹 열람 페이지
      print/
        page.tsx        # PDF 생성 기준 페이지 (/portfolio/print)
    api/                # API 라우트
  components/           # 재사용 UI 컴포넌트
  data/                 # 포트폴리오 데이터 (TypeScript 상수)
```

## 실행 방법

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### 린트

```bash
npm run lint
```

## PDF Export

포트폴리오를 PDF로 내보내려면:

1. 개발 서버 또는 프로덕션 서버를 실행합니다.
2. `/portfolio/print` 페이지가 PDF 렌더링 기준 페이지입니다.
3. API 라우트(`/api/...`)를 통해 Puppeteer가 해당 페이지를 headless Chrome으로 렌더링해 PDF를 생성합니다.

한글 텍스트가 깨지지 않도록 Noto Sans KR 웹폰트 로딩 완료 후 캡처합니다.
