# PPT 생성기

이력서 / 포트폴리오 PPT (KO·EN) 자동 생성.
프로젝트나 스펙이 바뀌면 `data/` 안의 Python 파일만 수정.

## 구조

```
ppt/
  theme.py                 # 색상·폰트·사이즈 등 디자인 토큰
  components.py            # 슬라이드 빌더 헬퍼 (텍스트, 카드, 태그…)
  generate_resume.py       # 이력서 PPT 생성기 (KO/EN)
  generate_portfolio.py    # 포트폴리오 PPT 생성기 (KO/EN)
  data/
    resume_ko.py           # 이력서 (한국어) 데이터
    resume_en.py           # 이력서 (영어) 데이터
    portfolio_ko.py        # 포트폴리오 (한국어) 데이터
    portfolio_en.py        # 포트폴리오 (영어) 데이터
  output/                  # 생성된 .pptx 결과물
```

## 설치 (최초 1회)

### macOS / Linux

```bash
cd ppt
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> WSL 에서 `python3 -m venv` 가 안 되면: `sudo apt install python3-venv python3-pip -y`

### Windows (또는 WSL 에서 Windows Python 호출)

```powershell
pip install python-pptx
```

WSL 에서 Windows Python 으로 실행하려면:
```bash
/mnt/c/Users/<USER>/AppData/Local/Programs/Python/Python312/python.exe generate_resume.py --lang ko
```

## 사용법

```bash
# 이력서
python3 generate_resume.py                # 한국어 (output/Resume_KO.pptx)
python3 generate_resume.py --lang en      # 영어   (output/Resume_EN.pptx)

# 포트폴리오
python3 generate_portfolio.py             # 한국어 (output/Portfolio_KO.pptx)
python3 generate_portfolio.py --lang en   # 영어   (output/Portfolio_EN.pptx)

# 출력 경로 직접 지정
python3 generate_resume.py --lang ko --out ./output/내이력서.pptx
```

## 데이터 수정 가이드

- **새 프로젝트 추가**: `data/portfolio_ko.py` 와 `data/portfolio_en.py` 의 `PROJECTS` 리스트에 동일한 키로 추가.
- **이력서 프로젝트 한 줄 요약 수정**: `data/resume_*.py` 의 `PROJECTS` 항목 수정.
- **스킬 추가**: `data/resume_*.py` 의 `SKILLS` 딕셔너리에 카테고리/항목 추가.
- **이미지**: `diagram` 경로는 프로젝트 루트 기준 상대경로. 파일이 없으면 회색 placeholder 로 자동 대체됨.

## 디자인 변경

- 색상·폰트·사이즈 → `theme.py` 한 곳에서 수정 (이력서·포트폴리오 동시 반영)
- 슬라이드 레이아웃 → `generate_resume.py` / `generate_portfolio.py` 의 `slide_*` 함수에서 수정
