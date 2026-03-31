import { profile } from "@/data/en/profile";
import { certifications } from "@/data/en/certifications";
import { skills } from "@/data/en/skills";
import { projects } from "@/data/en/projects";
import { highlights } from "@/data/en/highlights";
import { PrintButton } from "@/components/PrintButton";

export const metadata = {
  title: `Resume — ${profile.name}`,
  robots: { index: false, follow: false },
};

// Tech stack tags to show per project (most representative ones)
const projectTechTags: Record<string, string[]> = {
  backend:        ["Spring Boot", "Spring Security / OAuth2 / JWT", "JPA / MySQL", "Redis", "Docker Compose", "GitHub Actions"],
  infrastructure: ["AWS EKS", "Terraform", "KEDA", "Karpenter", "ArgoCD", "Prometheus", "IRSA"],
  devops:         ["Next.js", "AWS Lambda", "CloudFront + S3", "API Gateway", "Terraform", "GitHub Actions", "EventBridge + SES"],
};

// Key bullet points per project
const projectBullets: Record<string, string[]> = {
  backend: [
    "Designed and implemented REST API for posts, comments (nested), likes, and reports using Spring Boot + JPA",
    "Integrated OAuth2 + JWT + Spring Security authentication and Redis caching layer",
    "Standardized team dev environment via Docker Compose, reducing environment-related errors",
  ],
  infrastructure: [
    "Architected EKS-based platform with multi-layer autoscaling: KEDA (request-based) + Karpenter (node-level)",
    "Validated 2,000 RPS / 120,000 requests with zero downtime in QA environment",
    "Centralized GitLab, monitoring, and DNS security observability via Central VPC + Transit Gateway",
    "Applied GitOps (ArgoCD) and IRSA for consistent deployment state and least-privilege security",
  ],
  devops: [
    "Built full serverless architecture: CloudFront + S3 (static) + Lambda + API Gateway (PDF, feedback)",
    "Automated all infra with Terraform IaC; CI/CD via GitHub Actions (build → S3 → CloudFront invalidation)",
    "Implemented EventBridge + SES feedback pipeline and CloudWatch + SNS alerting",
    "Secured with WAF, OAC, HSTS/X-Frame-Options headers, ACM, and X-Ray distributed tracing",
  ],
};

const projectTeamRole: Record<string, string> = {
  backend:        "Team Member",
  infrastructure: "Team Lead",
  devops:         "Solo",
};

export default function ResumePage() {
  return (
    <div className="bg-white text-neutral-900 print:text-black font-sans">
      <PrintButton />

      <div className="max-w-[210mm] mx-auto px-[14mm] py-[12mm] text-[10pt] leading-relaxed">

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <header className="mb-6 pb-5 border-b-2 border-neutral-900">
          <h1 className="text-[22pt] font-bold tracking-tight text-neutral-900 leading-none mb-1">
            {profile.name}
          </h1>
          <p className="text-[11pt] text-neutral-500 mb-3">{profile.title}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-neutral-500">
            {profile.links.email     && <span>✉ {profile.links.email}</span>}
            {profile.links.phone     && <span>☏ {profile.links.phone}</span>}
            {profile.links.portfolio && <span>Portfolio: {profile.links.portfolio}</span>}
            {profile.links.github    && <span>GitHub: {profile.links.github}</span>}
            {profile.links.blog      && <span>✎ {profile.links.blog}</span>}
          </div>
        </header>

        {/* ══ SUMMARY ═════════════════════════════════════════ */}
        <section className="mb-6">
          <ResumeSection>Summary</ResumeSection>
          <p className="text-neutral-700 leading-relaxed">{profile.summary}</p>
        </section>

        {/* ══ EDUCATION ═══════════════════════════════════════ */}
        <section className="mb-6">
          <ResumeSection>Education</ResumeSection>
          <div className="flex justify-between items-baseline">
            <div>
              <span className="font-semibold text-neutral-900">{profile.education.school}</span>
              <span className="text-neutral-500 mx-2">·</span>
              <span className="text-neutral-700">{profile.education.major}</span>
            </div>
            <span className="text-xs text-neutral-400 shrink-0">{profile.education.period}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            GPA {profile.education.gpa} &nbsp;·&nbsp; Major GPA {profile.education.majorGpa}
          </p>
        </section>

        {/* ══ EXPERIENCE ══════════════════════════════════════ */}
        {profile.experience && profile.experience.length > 0 && (
          <section className="mb-6">
            <ResumeSection>Experience</ResumeSection>
            <div className="space-y-3">
              {profile.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-neutral-900">{exp.company}</span>
                      {exp.role && (
                        <>
                          <span className="text-neutral-400 mx-2">·</span>
                          <span className="text-neutral-600">{exp.role}</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400 shrink-0">{exp.period}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {exp.description.map((line, j) => (
                      <li key={j} className="flex gap-2 text-neutral-700">
                        <span className="text-neutral-400 shrink-0">–</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ MILITARY SERVICE ════════════════════════════════ */}
        {profile.militaryService && (
          <section className="mb-6">
            <ResumeSection>Military Service</ResumeSection>
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-semibold text-neutral-900">{profile.militaryService.branch}</span>
                <span className="text-neutral-500 mx-2">·</span>
                <span className="text-neutral-600">
                  {profile.militaryService.status === "completed"
                    ? "Honorably Discharged"
                    : profile.militaryService.status === "exempted"
                    ? "Military Exemption"
                    : "Currently Serving"}
                </span>
              </div>
              <span className="text-xs text-neutral-400 shrink-0">{profile.militaryService.period}</span>
            </div>
          </section>
        )}

        {/* ══ PROJECTS ════════════════════════════════════════ */}
        <section className="mb-6">
          <ResumeSection>Projects</ResumeSection>
          <div className="space-y-5">
            {projects.map((project) => (
              <div key={project.category} className="print-break-avoid">
                {/* Title row */}
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-neutral-900">{project.title}</span>
                    <span className="text-xs text-neutral-400">
                      {projectTeamRole[project.category]}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 shrink-0">{project.period}</span>
                </div>
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {(projectTechTags[project.category] ?? []).map((t) => (
                    <span key={t} className="text-[8pt] px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                      {t}
                    </span>
                  ))}
                </div>
                {/* Bullets */}
                <ul className="space-y-0.5">
                  {(projectBullets[project.category] ?? []).map((b, i) => (
                    <li key={i} className="flex gap-2 text-neutral-700 text-[9.5pt]">
                      <span className="text-neutral-400 shrink-0">–</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ══ KEY HIGHLIGHTS ══════════════════════════════════ */}
        <section className="mb-6">
          <ResumeSection>Key Highlights</ResumeSection>
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-3 text-[9.5pt] print-break-avoid">
                <span className="shrink-0 text-neutral-400 text-[8pt] mt-0.5 w-28 leading-snug font-medium">
                  [{h.category}]
                </span>
                <span className="text-neutral-700 leading-relaxed">
                  <span className="font-medium text-neutral-800">{h.title}: </span>
                  {h.result}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SKILLS ══════════════════════════════════════════ */}
        <section className="mb-6">
          <ResumeSection>Skills</ResumeSection>
          <div className="space-y-1.5">
            {skills.map((cat) => (
              <div key={cat.category} className="flex gap-3 text-[9.5pt]">
                <span className="shrink-0 font-semibold text-neutral-500 w-28">{cat.category}</span>
                <span className="text-neutral-700">
                  {cat.items.map((s) => s.name).join(" · ")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CERTIFICATIONS ══════════════════════════════════ */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <ResumeSection>Certifications</ResumeSection>
            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={i} className="print-break-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-neutral-800 text-[9.5pt]">{cert.name}</span>
                    <span className="text-xs text-neutral-400 shrink-0 ml-3">{cert.date}</span>
                  </div>
                  <div className="flex items-baseline gap-2 text-[8.5pt] text-neutral-400 mt-0.5">
                    <span>{cert.issuer}</span>
                    {cert.certNumber && (
                      <>
                        <span>·</span>
                        <span className="font-mono tracking-tight">{cert.certNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ EXTRACURRICULAR ═════════════════════════════════ */}
        {profile.bootcamp && profile.bootcamp.length > 0 && (
          <section className="mb-6">
            <ResumeSection>Training & Activities</ResumeSection>
            <div className="space-y-1.5">
              {profile.bootcamp.map((b, i) => (
                <div key={i} className="flex justify-between items-baseline text-[9.5pt]">
                  <div>
                    <span className="font-medium text-neutral-800">{b.name}</span>
                    <span className="text-neutral-500 ml-2">{b.organizer}</span>
                  </div>
                  <span className="text-xs text-neutral-400">{b.period}</span>
                </div>
              ))}
              {profile.clubs?.map((club, i) => (
                <div key={i} className="flex justify-between items-baseline text-[9.5pt]">
                  <span className="text-neutral-700">{club.name}</span>
                  <span className="text-xs text-neutral-400">{club.period}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

function ResumeSection({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[8pt] font-bold tracking-[0.15em] uppercase text-neutral-400 border-b border-neutral-200 pb-1 mb-2.5">
      {children}
    </h2>
  );
}
