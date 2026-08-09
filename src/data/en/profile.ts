import type { Profile } from "@/data/profile";

export const profile: Profile = {
  name: "Kyeongmun Eom",
  birthdate: "2002.03.21",
  education: {
    school: "Dongguk University",
    major: "Department of Information and Communication Engineering",
    period: "Mar 2021 – Feb 2027 (Expected)",
    gpa: "4.06 / 4.5",
    majorGpa: "4.20 / 4.50",
  },
  title: "Cloud-Native Engineer Who Builds Services and Owns the Infrastructure",
  summary:
    "I build end-to-end — from Spring Boot backends to Terraform-managed cloud infrastructure. Through CJ OliveNetworks Cloud Wave and hands-on experience, I have developed practical skills in AWS architecture, CI/CD pipelines, and container orchestration, with a growing focus on AI/LLM-powered operational automation.",
  bootcamp: [
    {
      name: "Cloud Wave 7th Cohort",
      organizer: "CJ OliveNetworks",
      period: "Dec 2025 – Feb 2026",
    },
  ],
  experience: [
    {
      company: "Rock Korea (Intern)",
      role: "Software Engineer Intern",
      period: "Mar 2026 – Aug 2026",
      description: [
        "Developed an LLM- and RAG-based automotive cybersecurity Q&A automation tool.",
        "Built AI-native CI/CD error handling — GitHub Actions captures build/test failure logs, summarizes root cause via LLM, and sends actionable fix guidance to Slack in real time.",
        "Authored a research paper on SDV OTA security for the Korean Society of Automotive Engineers (KSAE).",
        "Gained practical experience in connecting AI-based systems with real engineering workflows.",
      ],
      paper: {
        title:
          "Race Conditions and a Hierarchical Safe-Transition Protocol in SDV OTA Wave Switching",
        summary:
          "Quantified the race conditions and security holes that arise during wave switching of a Kubernetes + Istio OTA backend (auth→campaign→package→deploy), and designed and validated a Hierarchical Safe-Transition Protocol (HSTP) to eliminate them. Deactivation order alone shifted the security hole from ~52s to 0s, and HSTP + microsegmentation achieved a 99.1% lateral-movement blocking rate and an 85.6% request success rate.",
        keywords: ["SDV / OTA", "Kubernetes", "Istio", "Zero Trust", "mTLS"],
        pdf: "/images/sdv_ota_paper.pdf",
      },
    },
  ],
  clubs: [
    { name: "FC TOTO (University Soccer Club)", period: "Mar 2022 – Aug 2025" },
    { name: "LINKERS (Career Exploration Club)", period: "Sep 2024 – Dec 2024" },
    { name: "TAVE (Developer Club)", period: "Mar 2025 – Jul 2025" },
    { name: "FC Jeongtong (Soccer Club, Captain)", period: "Mar 2025 – Feb 2026" },
  ],
  militaryService: {
    branch: "Republic of Korea Army (Sergeant)",
    period: "May 30, 2022 – Nov 29, 2023",
    status: "completed",
  },
  keywords: ["AWS / Cloud", "Docker / DevOps", "Infra Architecture"],
  links: {
    email: "eomkyeongmun@naver.com",
    phone: "010-4716-6629",
    portfolio: "https://www.eomkyeongmun.me/en",
    github: "https://github.com/eomkyeongmun",
    blog: "https://velog.io/@eomkyeongmun/posts",
  },
};
