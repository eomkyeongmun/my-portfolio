---
name: PDF Export
description: Rules and guidelines for generating a PDF from the /portfolio/print page
---

# PDF Export Rules

이 스킬은 포트폴리오의 `/portfolio/print` 페이지를 기반으로 PDF를 생성할 때 준수해야 하는 규칙과 팁을 정의합니다. 다음 규칙들을 바탕으로 작업하세요.

## 1. Puppeteer 설정
- PDF 생성 시 `puppeteer` 또는 `puppeteer-core`를 사용합니다.
- 안정적인 렌더링을 위해 네트워크 로딩이 완전히 끝날 때까지 대기해야 합니다.
- **예시 스크립트:**
  ```javascript
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // 폰트 및 이미지 로딩 대기
  await page.goto('http://localhost:3000/portfolio/print', { 
    waitUntil: 'networkidle0' 
  });
  
  await page.pdf({
    path: 'portfolio.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  });
  
  await browser.close();
  ```

## 2. A4 여백 (Margins)
- A4 규격에 맞게 상하좌우 **최소 `10mm`의 여백**을 설정해야 합니다.
- 웹 브라우저의 기본 인쇄 여백과 다를 수 있으므로, PDF 출력 옵션(`page.pdf()`)의 `margin` 속성에 명시적으로 설정하는 것이 안전합니다.

## 3. 페이지 나누기 (Page-break)
- 프로젝트 설명, 카드 UI 등 하나의 컨텐츠 블록이 페이지 중간에서 잘리는 것을 방지해야 합니다.
- 잘리면 안 되는 컨테이너에는 다음 CSS를 적용합니다:
  ```css
  /* 페이지 잘림 방지 */
  .avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  ```
- 강제로 다음 페이지로 넘겨야 하는 섹션이 있다면 다음 속성을 사용합니다:
  ```css
  /* 새 페이지에서 시작 */
  .page-break {
    page-break-before: always;
    break-before: page;
  }
  ```

## 4. Print CSS (`@media print`)
- 인쇄용 PDF에는 네비게이션바, 푸터, 상호작용용 버튼(예: 다크모드 토글, 'PDF 다운로드' 버튼)이 노출되지 않도록 숨깁니다.
- 배경색과 글자색의 대비를 명확히 하여(흰 배경 / 검은 글자) 인쇄 가독성을 높여야 할 수 있습니다.
  ```css
  @media print {
    /* 불필요한 UI 요소 숨김 */
    nav, footer, .btn-print, .hide-on-print {
      display: none !important;
    }
    
    /* 그림자나 애니메이션 효과 제거 (선택사항) */
    * {
      box-shadow: none !important;
      transition: none !important;
    }
  }
  ```

## 5. 한글 폰트 확인 규칙
- PDF를 생성하는 환경(리눅스 서버, CI/CD 컨테이너 등)에 한글 폰트가 설치되어 있지 않으면, 텍스트가 네모 박스(또는 깨짐)로 출력될 수 있습니다.
- **해결 및 확인 방법:**
  1. **OS/컨테이너 레벨 폰트 설치:** 구동 환경에 `fonts-noto-cjk`, `fonts-nanum` 패키지가 설치되었는지 확인합니다.
  2. **웹 폰트 렌더링 대기:** 웹 폰트(@font-face) 방식을 사용한다면, Puppeteer 설정 시 `waitUntil: 'networkidle0'`를 필수로 사용하여 폰트 파일 로딩이 완료된 후에 렌더링되게 합니다. (만약 폰트 파일이 무겁다면 `document.fonts.ready`를 명시적으로 기다리는 로직을 페이지나 스크립트 쪽에 추가하기도 합니다.)
