# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

개인 포트폴리오 웹사이트. 웹 열람용 페이지와 PDF 다운로드 기능을 함께 제공한다.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**, **TypeScript**
- **Tailwind CSS v4** — CSS-first config via `@import "tailwindcss"` in `globals.css` (no `tailwind.config` file)
- **Puppeteer** — PDF 생성에 사용. `/portfolio/print` 페이지를 headless Chrome으로 렌더링해 PDF로 저장
- **Geist fonts** — `next/font/google`로 로드, CSS 변수 `--font-geist-sans` / `--font-geist-mono`로 노출

## Architecture

```
src/
  app/
    layout.tsx              # 루트 레이아웃 (폰트, 메타데이터, flex body)
    page.tsx                # 홈 페이지
    portfolio/
      page.tsx              # 포트폴리오 웹 열람 페이지
      print/
        page.tsx            # PDF 생성 기준 페이지 (/portfolio/print)
  components/               # 재사용 UI 컴포넌트
  data/                     # 포트폴리오 데이터 (TypeScript 파일로 분리)
  app/globals.css           # Tailwind import + CSS 변수 (background/foreground, dark mode)
```

데이터는 `src/data/`에 TypeScript 상수로 관리하고, 컴포넌트에서 import해서 사용한다.

## PDF 생성

- Puppeteer가 `/portfolio/print`를 렌더링해 PDF를 생성한다.
- `/portfolio/print` 페이지는 화면용 레이아웃과 별도로 인쇄에 최적화된 구조로 작성한다.
- `@media print` CSS를 항상 고려한다: 불필요한 UI 숨김, 페이지 나눔(`page-break`), 여백 등.

## 한글 폰트

- 한글이 포함된 텍스트는 반드시 한글 웹폰트(예: Noto Sans KR)를 명시적으로 지정한다.
- Puppeteer PDF 렌더링 시 시스템 폰트에 의존하지 말고, CSS `@font-face` 또는 Google Fonts로 폰트를 로드한다.
- `/portfolio/print` 페이지에서 한글 폰트 로딩 완료 후 PDF를 캡처해야 깨지지 않는다.

## 개발 원칙

- **반응형 우선**: 모바일 → 데스크톱 순으로 Tailwind 브레이크포인트 적용.
- **가독성 최우선**: 폰트 크기, 줄간격, 대비를 충분히 확보한다. 장식보다 내용이 먼저다.
- 웹 페이지와 print 페이지가 같은 데이터(`src/data/`)를 공유하도록 컴포넌트를 설계한다.
