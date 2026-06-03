import { profile as profileKo } from "../../src/data/profile";
import { projects as projectsKo } from "../../src/data/projects";
import { skills as skillsKo } from "../../src/data/skills";
import { certifications as certsKo } from "../../src/data/certifications";
import { highlights as highlightsKo } from "../../src/data/highlights";

import { profile as profileEn } from "../../src/data/en/profile";
import { projects as projectsEn } from "../../src/data/en/projects";
import { skills as skillsEn } from "../../src/data/en/skills";
import { certifications as certsEn } from "../../src/data/en/certifications";
import { highlights as highlightsEn } from "../../src/data/en/highlights";

import type { Lang } from "./types";

export interface PortfolioData {
  profile: typeof profileKo;
  projects: typeof projectsKo;
  skills: typeof skillsKo;
  certifications: typeof certsKo;
  highlights: typeof highlightsKo;
}

/** 언어별 공유 데이터(src/data)를 묶어서 반환. 단일 소스 — 기업별로 복제하지 않는다. */
export function getData(lang: Lang): PortfolioData {
  if (lang === "en") {
    return {
      profile: profileEn,
      projects: projectsEn,
      skills: skillsEn,
      certifications: certsEn,
      highlights: highlightsEn,
    };
  }
  return {
    profile: profileKo,
    projects: projectsKo,
    skills: skillsKo,
    certifications: certsKo,
    highlights: highlightsKo,
  };
}
