"""
포트폴리오 PPT 생성기
- 사용법:
    python3 generate_portfolio.py            # ko (기본)
    python3 generate_portfolio.py --lang en  # 영어
    python3 generate_portfolio.py --lang ko --out ./output/Portfolio_KO.pptx

설계 메모:
- 슬라이드 1: 표지
- 슬라이드 2: 프로젝트 목차
- 슬라이드 3+: 프로젝트당 1슬라이드 (아키텍처 이미지 + 요약/하이라이트/문제해결/기술스택)
- 디자인 토큰은 theme.py, 슬라이드 빌더 헬퍼는 components.py 에 있음
"""
import argparse
import importlib
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

from theme import (
    COLOR_FG, COLOR_MUTED, COLOR_ACCENT, COLOR_LINE, COLOR_ACCENT_SOFT, COLOR_CARD,
    SIZE_H2, SIZE_H3, SIZE_BODY, SIZE_SMALL, SIZE_TAG,
    font_for,
)
from components import (
    new_presentation, add_blank_slide, add_text, add_rect, add_line,
    add_tag, add_header, add_footer, add_image_safe,
)

# 프로젝트 루트 (이미지 경로 해석용)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def slide_cover(prs, data, lang):
    s = add_blank_slide(prs)
    font = font_for(lang)
    o = data.OWNER

    # 상단 강조 영역
    add_rect(s, Inches(0), Inches(0), Inches(13.34), Inches(3.6),
             fill=COLOR_ACCENT_SOFT, line=None, radius=0.0)

    add_text(s, o["subtitle"], Inches(0.8), Inches(1.4), Inches(11), Inches(0.5),
             font=font, size=Pt(20), color=COLOR_ACCENT, bold=True)
    add_text(s, o["name"], Inches(0.8), Inches(1.85), Inches(11), Inches(1.0),
             font=font, size=Pt(56), color=COLOR_FG, bold=True)
    add_text(s, o["title"], Inches(0.8), Inches(2.85), Inches(11.5), Inches(0.6),
             font=font, size=Pt(18), color=COLOR_MUTED)

    # 하단 메타
    add_line(s, Inches(0.8), Inches(4.3), Inches(11.5))
    add_text(s,
             ("Projects in this deck" if lang == "en" else "수록 프로젝트")
             + f"   ·   {len(data.PROJECTS)}",
             Inches(0.8), Inches(4.5), Inches(11.5), Inches(0.4),
             font=font, size=SIZE_BODY, color=COLOR_FG, bold=True)

    top = Inches(5.0)
    for i, proj in enumerate(data.PROJECTS, 1):
        add_text(s, f"{i:02d}", Inches(0.8), top, Inches(0.5), Inches(0.35),
                 font=font, size=SIZE_BODY, color=COLOR_ACCENT, bold=True)
        add_text(s, proj["title"], Inches(1.4), top, Inches(7.5), Inches(0.35),
                 font=font, size=SIZE_BODY, color=COLOR_FG, bold=True)
        add_text(s, proj["period"], Inches(9.0), top, Inches(3.5), Inches(0.35),
                 font=font, size=SIZE_SMALL, color=COLOR_MUTED, align=PP_ALIGN.RIGHT)
        top += Inches(0.4)

    add_text(s, f"{o['portfolio_url']}   ·   {o['github']}",
             Inches(0.8), Inches(7.05), Inches(11.5), Inches(0.3),
             font=font, size=SIZE_SMALL, color=COLOR_MUTED)


def slide_project(prs, proj, idx, total, lang):
    s = add_blank_slide(prs)
    font = font_for(lang)

    # 헤더 (No. 카테고리 / 제목 / 기간)
    add_text(s, f"#{idx:02d}  {proj['category']}",
             Inches(0.6), Inches(0.45), Inches(8), Inches(0.35),
             font=font, size=SIZE_SMALL, color=COLOR_ACCENT, bold=True)
    add_text(s, proj["title"], Inches(0.6), Inches(0.75), Inches(9.5), Inches(0.65),
             font=font, size=Pt(30), color=COLOR_FG, bold=True)
    add_text(s, f"{proj['period']}    |    {proj['role']}",
             Inches(0.6), Inches(1.4), Inches(9.5), Inches(0.35),
             font=font, size=SIZE_BODY, color=COLOR_MUTED)

    # 우측 상단: 링크 박스
    if proj.get("link"):
        add_rect(s, Inches(10.3), Inches(0.55), Inches(2.4), Inches(0.5),
                 fill=COLOR_ACCENT_SOFT, line=None, radius=0.5)
        add_text(s, proj["link"], Inches(10.3), Inches(0.55), Inches(2.4), Inches(0.5),
                 font=font, size=Pt(10), color=COLOR_ACCENT, bold=True,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    add_line(s, Inches(0.6), Inches(1.85), Inches(12.13))

    # ── 좌측: 아키텍처 이미지 + 요약 ─────────────────────────────
    diagram_abs = os.path.join(PROJECT_ROOT, proj["diagram"]) if proj.get("diagram") else None
    add_image_safe(s, diagram_abs, Inches(0.6), Inches(2.05), Inches(6.5), Inches(2.9))

    add_text(s, "Overview" if lang == "en" else "개요",
             Inches(0.6), Inches(5.05), Inches(6.5), Inches(0.35),
             font=font, size=SIZE_H3, color=COLOR_ACCENT, bold=True)
    add_text(s, proj["summary"],
             Inches(0.6), Inches(5.4), Inches(6.5), Inches(1.65),
             font=font, size=SIZE_BODY, color=COLOR_FG, line_spacing=1.4)

    # ── 우측 상단: 하이라이트 ────────────────────────────────────
    add_text(s, "Highlights" if lang == "en" else "핵심 포인트",
             Inches(7.3), Inches(2.05), Inches(5.5), Inches(0.35),
             font=font, size=SIZE_H3, color=COLOR_ACCENT, bold=True)
    top = Inches(2.45)
    for h in proj["highlights"]:
        # 불릿 마커
        add_text(s, "▸", Inches(7.3), top, Inches(0.3), Inches(0.3),
                 font=font, size=Pt(11), color=COLOR_ACCENT, bold=True)
        add_text(s, h, Inches(7.55), top, Inches(5.25), Inches(0.5),
                 font=font, size=Pt(11), color=COLOR_FG, line_spacing=1.3)
        top += Inches(0.45)

    # ── 우측 중간: 문제/결과 ─────────────────────────────────────
    add_text(s, "Problem → Result" if lang == "en" else "문제 → 결과",
             Inches(7.3), Inches(4.5), Inches(5.5), Inches(0.35),
             font=font, size=SIZE_H3, color=COLOR_ACCENT, bold=True)
    add_rect(s, Inches(7.3), Inches(4.85), Inches(5.5), Inches(1.05),
             fill=COLOR_CARD, line=COLOR_LINE, radius=0.06)
    add_text(s, proj["problem"],
             Inches(7.45), Inches(4.95), Inches(5.2), Inches(0.85),
             font=font, size=Pt(10), color=COLOR_FG, line_spacing=1.3)
    add_text(s, "→ " + proj["result"],
             Inches(7.3), Inches(5.97), Inches(5.5), Inches(0.5),
             font=font, size=Pt(10), color=COLOR_ACCENT, bold=True, line_spacing=1.3)

    # ── 하단: 기술 스택 ────────────────────────────────────────
    add_text(s, "Tech Stack" if lang == "en" else "기술 스택",
             Inches(0.6), Inches(6.55), Inches(6), Inches(0.3),
             font=font, size=SIZE_SMALL, color=COLOR_ACCENT, bold=True)
    x = Inches(0.6)
    y = Inches(6.85)
    for t in proj["tech_stack"]:
        x_next = add_tag(s, t, x, y, font=font)
        x = x_next + Inches(0.08)
        if x > Inches(12.5):
            x = Inches(0.6)
            y += Inches(0.35)

    add_footer(s, f"{idx} / {total}", lang)


def build(lang: str, out_path: str):
    data = importlib.import_module(f"data.portfolio_{lang}")

    prs = new_presentation()
    slide_cover(prs, data, lang)

    total = len(data.PROJECTS)
    for i, proj in enumerate(data.PROJECTS, 1):
        slide_project(prs, proj, i, total, lang)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    prs.save(out_path)
    print(f"saved: {out_path}")


def main():
    ap = argparse.ArgumentParser(description="포트폴리오 PPT 생성기")
    ap.add_argument("--lang", choices=["ko", "en"], default="ko")
    ap.add_argument("--out", default=None,
                    help="출력 경로 (기본: output/Portfolio_{LANG}.pptx)")
    args = ap.parse_args()

    out = args.out or os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "output", f"Portfolio_{args.lang.upper()}.pptx",
    )
    build(args.lang, out)


if __name__ == "__main__":
    main()
