"""
공통 디자인 토큰
- 색상, 폰트, 사이즈를 한 곳에서 관리
- 이력서 / 포트폴리오 모두 동일 디자인 사용
"""
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor


# ── 슬라이드 사이즈 (16:9) ──────────────────────────────────────────
SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

# ── 색상 ───────────────────────────────────────────────────────────
COLOR_BG          = RGBColor(0xFA, 0xFA, 0xFA)   # 배경 (오프화이트)
COLOR_FG          = RGBColor(0x17, 0x17, 0x17)   # 본문 텍스트
COLOR_MUTED       = RGBColor(0x6B, 0x72, 0x80)   # 보조 텍스트 (회색)
COLOR_ACCENT      = RGBColor(0x1E, 0x40, 0xAF)   # 강조 (진한 블루)
COLOR_ACCENT_SOFT = RGBColor(0xDB, 0xEA, 0xFE)   # 강조 배경 (연한 블루)
COLOR_LINE        = RGBColor(0xE5, 0xE7, 0xEB)   # 구분선
COLOR_CARD        = RGBColor(0xFF, 0xFF, 0xFF)   # 카드 배경

# ── 폰트 ───────────────────────────────────────────────────────────
# Pretendard / Noto Sans KR / Inter — 시스템에 있는 폰트로 자동 폴백
FONT_KO = "Pretendard"     # 없으면 PPT가 시스템 폴백 적용
FONT_EN = "Inter"
FONT_MONO = "JetBrains Mono"

# ── 폰트 사이즈 ────────────────────────────────────────────────────
SIZE_TITLE     = Pt(36)   # 슬라이드 제목
SIZE_SUBTITLE  = Pt(20)   # 서브타이틀
SIZE_H2        = Pt(22)   # 섹션 헤딩
SIZE_H3        = Pt(16)   # 카드 헤딩
SIZE_BODY      = Pt(13)   # 본문
SIZE_SMALL     = Pt(11)   # 캡션
SIZE_TAG       = Pt(10)   # 태그


def font_for(lang: str) -> str:
    return FONT_KO if lang == "ko" else FONT_EN
