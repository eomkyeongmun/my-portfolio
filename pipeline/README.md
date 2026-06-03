# PDF 파이프라인 (이력서 · 포트폴리오)

기업별로 **직무/포지션**과 **브랜드 색상**만 바꿔서, 동일한 내용의 이력서·포트폴리오 PDF를 생성한다.
링크로 못 내고 PDF 파일로 제출해야 하는 곳에 쓴다.

내용(프로필·프로젝트·스킬·자격증·성과)은 웹사이트와 **같은 소스**(`src/data/`, `src/data/en/`)를 읽으므로,
사이트를 고치면 PDF도 자동으로 같이 바뀐다. 복제본이 없다.

## 사용법

```bash
# 기본(default) — KO/EN, 이력서+포폴 4개 PDF 전부
npm run pdf

# 등록한 기업 id 로
npm run pdf -- --company=<id>

# 옵션 조합
npm run pdf -- --company=<id> --type=resume --lang=ko
npm run pdf -- --company=<id> --type=portfolio --lang=en
```

| 옵션 | 값 | 기본 |
|------|----|------|
| `--company` | `default` \| (등록한 id) | `default` |
| `--type` | `resume` \| `portfolio` \| `all` | `all` |
| `--lang` | `ko` \| `en` \| `all` | `all` |

결과물: `out/<company>-<type>-<lang>.pdf` (예: `out/default-resume-ko.pdf`)

> 기업 config 는 미리 박아두지 않는다. 지원할 때마다 아래 절차로 하나씩 추가한다.

## 새 기업 추가

1. `pipeline/companies/_example.ts` 를 복사해 `pipeline/companies/<id>.ts` 생성, 값 채우기:

```ts
import type { CompanyConfig } from "../lib/types";

export const <id>: CompanyConfig = {
  id: "<id>",
  displayName: "회사명",
  displayNameEn: "Company",
  role: "지원 직무 / 포지션",
  roleEn: "Target Role / Position",
  accent: "#0064FF", // 브랜드 색 hex
};
```

2. `pipeline/companies/index.ts` 에 import + `companies` 에 등록.
3. `npm run pdf -- --company=<id>` 실행.

> 보통은 이 작업을 직접 안 해도 된다 — 지원 기업·직무·색을 알려주면 config 를 만들어 준다.

## 이력서 vs 포트폴리오 구분

- **이력서(resume)**: 1~2장 요약. 요약·학력·경력·**기술 스택**·**정량 성과(Key Highlights)**·자격증·병역/활동.
  프로젝트는 한 줄 요약 + 핵심 기술 태그만.
- **포트폴리오(portfolio)**: 프로젝트 1개당 1페이지. Overview / Architecture / Tech Stack / 문제 해결 / 회고 + 연구(논문).

## 구조

```
pipeline/
  companies/   기업별 config (직무·색상)  + index.ts(레지스트리)
  lib/         types · theme(색상) · fonts(한글) · data(공유 데이터) · labels(KO/EN)
  templates/   Resume.tsx · Portfolio.tsx · ui.tsx (@react-pdf/renderer)
  fonts/       NanumGothic TTF (한글)
  generate.tsx CLI 진입점
out/           생성된 PDF (gitignore)
```

엔진: `@react-pdf/renderer` — 브라우저/Chromium 불필요, `node`(tsx)로 바로 생성.
