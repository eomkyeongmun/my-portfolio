import type { Lang } from "./types";

export interface Labels {
  resumeTitle: string;
  portfolioTitle: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  highlights: string;
  projects: string;
  certifications: string;
  military: string;
  activities: string;
  research: string;
  gpa: string;
  majorGpa: string;
  role: string;
  problem: string;
  solution: string;
  result: string;
  issue: string;
  analysis: string;
  architecture: string;
  techStack: string;
  retrospective: string;
  improvements: string;
  regrets: string;
  futureWork: string;
  privateProject: string;
}

const ko: Labels = {
  resumeTitle: "이력서",
  portfolioTitle: "포트폴리오",
  summary: "요약",
  education: "학력",
  experience: "경력",
  skills: "기술 스택",
  highlights: "주요 성과",
  projects: "프로젝트",
  certifications: "자격증",
  military: "병역",
  activities: "교육 · 활동",
  research: "연구 · 논문",
  gpa: "학점",
  majorGpa: "전공",
  role: "담당",
  problem: "문제",
  solution: "해결",
  result: "결과",
  issue: "이슈",
  analysis: "분석",
  architecture: "아키텍처",
  techStack: "기술 스택",
  retrospective: "회고",
  improvements: "개선점",
  regrets: "아쉬운 점",
  futureWork: "향후 방향",
  privateProject: "사내 프로젝트 · 코드 비공개",
};

const en: Labels = {
  resumeTitle: "Resume",
  portfolioTitle: "Portfolio",
  summary: "Summary",
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  highlights: "Key Highlights",
  projects: "Projects",
  certifications: "Certifications",
  military: "Military Service",
  activities: "Training & Activities",
  research: "Research",
  gpa: "GPA",
  majorGpa: "Major",
  role: "Role",
  problem: "Problem",
  solution: "Solution",
  result: "Result",
  issue: "Issue",
  analysis: "Analysis",
  architecture: "Architecture",
  techStack: "Tech Stack",
  retrospective: "Retrospective",
  improvements: "Improvements",
  regrets: "Regrets",
  futureWork: "Future Work",
  privateProject: "Internal project · code private",
};

export function getLabels(lang: Lang): Labels {
  return lang === "en" ? en : ko;
}

export function militaryStatus(status: string, lang: Lang): string {
  const map: Record<string, [string, string]> = {
    completed: ["만기 전역", "Honorably Discharged"],
    exempted: ["병역 면제", "Exempted"],
    in_progress: ["복무 중", "Currently Serving"],
  };
  const pair = map[status] ?? ["", ""];
  return lang === "en" ? pair[1] : pair[0];
}
