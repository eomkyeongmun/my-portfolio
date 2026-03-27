# Lambda 컨테이너 이미지 — Puppeteer + 한글 폰트(Noto Sans KR)
# 베이스: AWS Lambda Node.js 20 (Amazon Linux 2023)
FROM public.ecr.aws/lambda/nodejs:20

# ─── 시스템 패키지 설치 ──────────────────────────────────────────────────────
# Chromium 의존성 + fontconfig + curl
RUN dnf install -y \
      liberation-fonts \
      fontconfig \
    && dnf clean all

# ─── 한글 폰트 (Noto Sans KR) ───────────────────────────────────────────────
# Puppeteer PDF 렌더링 시 시스템 폰트에 의존하므로 반드시 설치해야 합니다.
# Google Fonts GitHub에서 OTF 파일을 직접 다운로드합니다.
RUN mkdir -p /usr/share/fonts/noto-kr \
    && curl -fsSL \
        "https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/KR/NotoSansKR-Regular.otf" \
        -o /usr/share/fonts/noto-kr/NotoSansKR-Regular.otf \
    && curl -fsSL \
        "https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/KR/NotoSansKR-Medium.otf" \
        -o /usr/share/fonts/noto-kr/NotoSansKR-Medium.otf \
    && curl -fsSL \
        "https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/KR/NotoSansKR-Bold.otf" \
        -o /usr/share/fonts/noto-kr/NotoSansKR-Bold.otf \
    && fc-cache -fv

# ─── Lambda 핸들러 의존성 설치 ───────────────────────────────────────────────
WORKDIR /var/task

COPY lambda/package.json ./
# package-lock.json 이 있으면 함께 복사 (ci 속도 향상)
COPY lambda/package*.json ./
RUN npm ci --omit=dev

# ─── Lambda 핸들러 복사 ──────────────────────────────────────────────────────
COPY lambda/ ./

# Lambda 핸들러 진입점: handler.mjs 의 named export `handler`
CMD ["handler.handler"]
