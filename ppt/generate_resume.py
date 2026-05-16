"""
이력서 PPT 생성기
- 사용법:
    python3 generate_resume.py            # ko (기본)
    python3 generate_resume.py --lang en  # 영어
    python3 generate_resume.py --lang ko --out ./output/Resume_KO.pptx

설계 메모:
- 슬라이드 1: 헤더 / 인적 / 핵심 키워드 / 학력 / 경력
- 슬라이드 2: 프로젝트 명 (요약 1줄) + 자격증 + 활동
- 슬라이드 3: 기술 스택 (카테고리별)
- 디자인 토큰은 theme.py, 슬라이드 빌더 헬퍼는 components.py 에 있음
"""
import argparse
import importlib
import os
import sys

# ppt/ 디렉토리를 import path에 추가
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
    add_tag, add_header, add_footer,
)


def slide_1_profile(prs, data, lang):
    s = add_blank_slide(prs)
    font = font_for(lang)
    p = data.PROFILE

    # ── 헤더 영역 (이름 + 타이틀) ────────────────────────────────
    add_text(s, p["name"], Inches(0.6), Inches(0.5), Inches(12.1), Inches(0.85),
             font=font, size=Pt(40), color=COLOR_FG, bold=True)
    add_text(s, p["title"], Inches(0.6), Inches(1.3), Inches(12.1), Inches(0.5),
             font=font, size=Pt(16), color=COLOR_MUTED)

    # 키워드 태그
    x = Inches(0.6)
    for kw in data.KEYWORDS:
        x = add_tag(s, kw, x, Inches(1.85), font=font)
        x += Inches(0.08)

    # 연락처 (우측 정렬 카드)
    contact_lines = [
        f"Email   {p['email']}",
        f"Phone   {p['phone']}",
        f"GitHub  {p['github']}",
        f"Blog    {p['blog']}",
        f"Web     {p['portfolio']}",
    ]
    add_rect(s, Inches(8.5), Inches(0.5), Inches(4.2), Inches(1.6),
             fill=COLOR_CARD, line=COLOR_LINE, radius=0.08)
    add_text(s, "\n".join(contact_lines),
             Inches(8.7), Inches(0.62), Inches(4.0), Inches(1.45),
             font=font, size=SIZE_SMALL, color=COLOR_FG, line_spacing=1.4)

    # 구분선
    add_line(s, Inches(0.6), Inches(2.4), Inches(12.13))

    # ── 학력 ────────────────────────────────────────────────────
    add_text(s, "EDUCATION" if lang == "en" else "학력",
             Inches(0.6), Inches(2.55), Inches(6), Inches(0.4),
             font=font, size=SIZE_H2, color=COLOR_ACCENT, bold=True)
    e = data.EDUCATION
    add_text(s, e["school"], Inches(0.6), Inches(3.05), Inches(8), Inches(0.4),
             font=font, size=SIZE_H3, color=COLOR_FG, bold=True)
    add_text(s, f"{e['major']}    |    {e['period']}    |    {e['gpa']}    |    {e['major_gpa']}",
             Inches(0.6), Inches(3.45), Inches(11.5), Inches(0.35),
             font=font, size=SIZE_BODY, color=COLOR_MUTED)

    # ── 경력 / 활동 ────────────────────────────────────────────
    add_text(s, "EXPERIENCE" if lang == "en" else "경력 / 부트캠프",
             Inches(0.6), Inches(4.0), Inches(6), Inches(0.4),
             font=font, size=SIZE_H2, color=COLOR_ACCENT, bold=True)
    top = Inches(4.5)
    for exp in data.EXPERIENCE:
        # 좌측: 회사 + 역할
        add_text(s, exp["company"], Inches(0.6), top, Inches(4.5), Inches(0.35),
                 font=font, size=SIZE_H3, color=COLOR_FG, bold=True)
        add_text(s, exp["role"], Inches(0.6), top + Inches(0.36), Inches(4.5), Inches(0.3),
                 font=font, size=SIZE_BODY, color=COLOR_MUTED)
        # 가운데: 기간
        add_text(s, exp["period"], Inches(5.2), top, Inches(2.3), Inches(0.35),
                 font=font, size=SIZE_BODY, color=COLOR_MUTED)
        # 우측: 설명
        add_text(s, exp["description"], Inches(7.6), top, Inches(5.1), Inches(0.7),
                 font=font, size=SIZE_BODY, color=COLOR_FG)
        top += Inches(0.85)

    add_footer(s, "1 / 3", lang)


def slide_2_projects_certs(prs, data, lang):
    s = add_blank_slide(prs)
    font = font_for(lang)
    add_header(s, "PROJECTS · ACTIVITIES" if lang == "en" else "프로젝트 · 활동", None, lang)

    # ── 프로젝트 (좌측) ────────────────────────────────────────
    add_text(s, "Projects" if lang == "en" else "프로젝트",
             Inches(0.6), Inches(1.75), Inches(6), Inches(0.4),
             font=font, size=SIZE_H2, color=COLOR_ACCENT, bold=True)
    top = Inches(2.25)
    for proj in data.PROJECTS:
        # 카드
        add_rect(s, Inches(0.6), top, Inches(7.6), Inches(1.15),
                 fill=COLOR_CARD, line=COLOR_LINE, radius=0.06)
        add_text(s, proj["title"], Inches(0.8), top + Inches(0.12),
                 Inches(5.5), Inches(0.4),
                 font=font, size=SIZE_H3, color=COLOR_FG, bold=True)
        add_text(s, proj["period"], Inches(0.8), top + Inches(0.12),
                 Inches(7.2), Inches(0.4),
                 font=font, size=SIZE_SMALL, color=COLOR_MUTED, align=PP_ALIGN.RIGHT)
        add_text(s, proj["summary"], Inches(0.8), top + Inches(0.5),
                 Inches(7.2), Inches(0.6),
                 font=font, size=SIZE_BODY, color=COLOR_FG, line_spacing=1.35)
        top += Inches(1.3)

    # ── 자격증 (우측 상단) ────────────────────────────────────
    add_text(s, "Certifications" if lang == "en" else "자격증",
             Inches(8.5), Inches(1.75), Inches(4.5), Inches(0.4),
             font=font, size=SIZE_H2, color=COLOR_ACCENT, bold=True)
    top = Inches(2.25)
    for c in data.CERTIFICATIONS:
        add_text(s, c["name"], Inches(8.5), top, Inches(4.2), Inches(0.3),
                 font=font, size=SIZE_BODY, color=COLOR_FG, bold=True)
        add_text(s, f"{c['issuer']}    |    {c['date']}",
                 Inches(8.5), top + Inches(0.3), Inches(4.2), Inches(0.28),
                 font=font, size=SIZE_SMALL, color=COLOR_MUTED)
        top += Inches(0.7)

    # ── 활동 (우측 하단) ──────────────────────────────────────
    add_text(s, "Activities" if lang == "en" else "활동",
             Inches(8.5), top + Inches(0.0), Inches(4.5), Inches(0.4),
             font=font, size=SIZE_H2, color=COLOR_ACCENT, bold=True)
    top += Inches(0.5)
    for a in data.ACTIVITIES:
        add_text(s, a["name"], Inches(8.5), top, Inches(4.2), Inches(0.28),
                 font=font, size=SIZE_BODY, color=COLOR_FG)
        add_text(s, a["period"], Inches(8.5), top + Inches(0.0), Inches(4.2), Inches(0.28),
                 font=font, size=SIZE_SMALL, color=COLOR_MUTED, align=PP_ALIGN.RIGHT)
        top += Inches(0.32)

    add_footer(s, "2 / 3", lang)


def slide_3_skills(prs, data, lang):
    s = add_blank_slide(prs)
    font = font_for(lang)
    add_header(s, "SKILLS" if lang == "en" else "기술 스택", None, lang)

    top = Inches(1.85)
    for category, items in data.SKILLS.items():
        # 카테고리 헤더
        add_text(s, category, Inches(0.6), top, Inches(3.5), Inches(0.4),
                 font=font, size=SIZE_H3, color=COLOR_ACCENT, bold=True)
        # 태그 묶음
        x = Inches(4.2)
        y = top + Inches(0.05)
        for item in items:
            x_next = add_tag(s, item, x, y, font=font)
            x = x_next + Inches(0.1)
            # 줄 넘침 처리
            if x > Inches(12.5):
                x = Inches(4.2)
                y += Inches(0.4)
        top += Inches(0.85)

    add_footer(s, "3 / 3", lang)


def build(lang: str, out_path: str):
    data_module = f"data.resume_{lang}"
    data = importlib.import_module(data_module)

    prs = new_presentation()
    slide_1_profile(prs, data, lang)
    slide_2_projects_certs(prs, data, lang)
    slide_3_skills(prs, data, lang)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    prs.save(out_path)
    print(f"saved: {out_path}")


def main():
    ap = argparse.ArgumentParser(description="이력서 PPT 생성기")
    ap.add_argument("--lang", choices=["ko", "en"], default="ko")
    ap.add_argument("--out", default=None,
                    help="출력 경로 (기본: output/Resume_{LANG}.pptx)")
    args = ap.parse_args()

    out = args.out or os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "output", f"Resume_{args.lang.upper()}.pptx",
    )
    build(args.lang, out)


if __name__ == "__main__":
    main()
