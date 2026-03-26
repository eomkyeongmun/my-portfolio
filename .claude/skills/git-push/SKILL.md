---
name: Git Push
description: 포트폴리오 프로젝트의 표준화된 Git 커밋·푸시 전략 및 절차
---

# Git Push 전략

이 스킬은 포트폴리오 프로젝트(`my-portfolio`)에서 변경 사항을 GitHub에 올릴 때 따라야 할 표준 절차를 정의합니다.

---

## 1. 브랜치 전략

- **`main`** — 항상 배포 가능한 안정 상태를 유지한다. 소규모 수정은 직접 push 허용.
- **`feat/<topic>`** — 새 기능 추가 (예: `feat/contact-section`)
- **`fix/<topic>`** — 버그 수정 (예: `fix/pdf-korean-font`)
- **`refactor/<topic>`** — 리팩터링 (예: `refactor/data-layer`)
- **`chore/<topic>`** — 빌드·설정·문서 등 비기능 변경 (예: `chore/update-deps`)

> 단독 작업이더라도 기능 단위가 크거나 되돌리기 어려운 변경이면 브랜치를 분리한다.

---

## 2. 커밋 메시지 규칙 (Conventional Commits)

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type 목록

| type       | 언제 사용 |
|------------|-----------|
| `feat`     | 새로운 기능 추가 |
| `fix`      | 버그 수정 |
| `refactor` | 동작 변경 없는 코드 구조 개선 |
| `style`    | 포맷·공백 등 (로직 무관) |
| `chore`    | 빌드·의존성·설정 변경 |
| `docs`     | 문서만 수정 |
| `perf`     | 성능 개선 |
| `test`     | 테스트 추가/수정 |

### Scope 예시 (이 프로젝트 기준)

`layout`, `portfolio`, `print`, `data`, `pdf`, `seo`, `a11y`, `font`, `dark-mode`

### 작성 규칙

- subject는 **현재형 동사**로 시작, 50자 이내 (한글 가능)
- 마침표 없이 끝낸다
- body가 필요하면 빈 줄 하나 띄운 뒤 작성 (무엇을, 왜)

### 예시

```
feat(portfolio): 프로젝트 카드에 GitHub 링크 추가

fix(print): A4 페이지 나눔 기준 margin 조정

refactor(data): 경력·프로젝트 데이터 파일 분리

chore(deps): puppeteer 2.x → 3.x 업그레이드

style(layout): 불필요한 공백 및 import 순서 정리
```

---

## 3. 푸시 전 체크리스트

```bash
# 1. 린트 확인
npm run lint

# 2. 프로덕션 빌드 확인 (타입 오류·빌드 실패 방지)
npm run build

# 3. 변경 파일 검토
git diff --stat

# 4. 스테이징
git add <파일>          # 특정 파일만 (git add -A 지양)

# 5. 커밋
git commit -m "type(scope): subject"

# 6. 푸시
git push origin <브랜치>
```

> `npm run build` 실패 시 절대 push하지 않는다.

---

## 4. main 직접 Push vs. PR

| 상황 | 방법 |
|------|------|
| 텍스트·데이터 수정, 단순 스타일 조정 | main 직접 push |
| 새 섹션·기능 추가, 레이아웃 변경 | 브랜치 → PR → main merge |
| 의존성 업그레이드, 빌드 설정 변경 | 브랜치 → PR → main merge |
| 배포 스크립트·CI 변경 | 브랜치 → PR → main merge |

---

## 5. PR 작성 가이드

PR 제목은 커밋 메시지 규칙과 동일하게, 본문에는 아래 템플릿을 사용한다.

```markdown
## 변경 사항
-

## 스크린샷 (해당 시)
<!-- 전/후 비교 이미지 -->

## 체크리스트
- [ ] `npm run lint` 통과
- [ ] `npm run build` 통과
- [ ] 웹 브라우저에서 직접 확인
- [ ] PDF 출력 확인 (print 페이지 변경 시)
```

---

## 6. 태그 / 릴리스 (선택)

버전 기록이 필요할 때 (예: PDF 이력서 버전)

```bash
git tag -a v1.0.0 -m "초기 포트폴리오 배포"
git push origin v1.0.0
```

형식: `vMAJOR.MINOR.PATCH` — 주요 재설계 / 섹션 추가 / 오탈자·소폭 수정

---

## 7. 금지 사항

- `git push --force` (main 브랜치에서 절대 금지)
- `.env`, 비밀키, 개인정보 포함 파일 커밋 금지
- 빌드 실패 상태 push 금지
- 하나의 커밋에 무관한 변경 사항 혼재 금지
