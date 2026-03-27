import Link from "next/link";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { highlights } from "@/data/highlights";
import { certifications } from "@/data/certifications";

const categoryColor: Record<string, string> = {
  장애대응: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CICD: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  모니터링: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  비용최적화: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  트래픽: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  성능개선: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  기타: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

const skillCategoryColor: Record<string, string> = {
  Backend: "bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Infrastructure: "bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  "DevOps/Tools": "bg-cyan-200 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
  Monitoring: "bg-violet-200 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300",
};

const projectCategoryColor: Record<string, string> = {
  backend: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  infrastructure: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  devops: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};


function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="font-mono text-neutral-400 dark:text-neutral-500 text-sm select-none">{"// "}</span>
      <span className="font-mono text-xs font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
        {children}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
          {profile.name}
        </h1>
        <p className="font-mono text-sm text-neutral-700 dark:text-neutral-300 mb-6">
          {profile.title}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {profile.keywords.map((kw, i) => {
            const colors = [
              "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
              "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
              "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
            ];
            return (
              <span
                key={kw}
                className={`font-mono px-2 py-0.5 text-xs rounded border ${colors[i % colors.length]}`}
              >
                {kw}
              </span>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.links.github && (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          )}
          {profile.links.blog && (
            <a
              href={profile.links.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 192 192" fill="currentColor">
                <path d="M96 16C51.8 16 16 51.8 16 96s35.8 80 80 80 80-35.8 80-80S140.2 16 96 16zm-9.5 116.8L52 96l11.3-11.3 23.2 23.2 42.2-42.2L140 77l-53.5 55.8z" />
              </svg>
              Velog
            </a>
          )}
          {profile.links.email && (
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 select-all">
              <svg aria-hidden="true" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {profile.links.email}
            </span>
          )}
        </div>
      </section>

      {/* ── Summary ──────────────────────────────────────── */}
      <section>
        <SectionLabel>about</SectionLabel>
        <p className="text-base leading-8 text-neutral-700 dark:text-neutral-300 border-l-2 border-emerald-200 dark:border-emerald-800 pl-4">
          {profile.summary}
        </p>
      </section>

      {/* ── Education ────────────────────────────────────── */}
      {profile.education && (
        <section>
          <SectionLabel>education</SectionLabel>
          <div className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8">
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{profile.education.school}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{profile.education.major}</p>
              </div>
              <div className="sm:ml-auto font-mono text-sm text-neutral-500 dark:text-neutral-400 space-y-0.5">
                <p>GPA <span className="text-neutral-800 dark:text-neutral-200">{profile.education.gpa}</span></p>
                <p>Major <span className="text-neutral-800 dark:text-neutral-200">{profile.education.majorGpa}</span></p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Bootcamp ─────────────────────────────────────── */}
      {profile.bootcamp && profile.bootcamp.length > 0 && (
        <section>
          <SectionLabel>bootcamp</SectionLabel>
          <div className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-4 space-y-4">
            {profile.bootcamp.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{item.organizer}</p>
                </div>
                <p className="sm:ml-auto font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:pt-0.5">
                  {item.period}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Experience ───────────────────────────────────── */}
      {profile.experience && profile.experience.length > 0 && (
        <section>
          <SectionLabel>experience</SectionLabel>
          <div className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-4 space-y-6">
            {profile.experience.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8">
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.company}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {item.role}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <p className="sm:ml-auto font-mono text-xs text-neutral-500 dark:text-neutral-400 shrink-0 sm:pt-0.5">
                  {item.period}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Certifications ───────────────────────────────── */}
      {certifications.length > 0 && (
        <section>
          <SectionLabel>certifications</SectionLabel>
          <div className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-4 space-y-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8">
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{cert.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{cert.issuer}</p>
                </div>
                <p className="sm:ml-auto font-mono text-xs text-neutral-500 dark:text-neutral-400 sm:pt-0.5 shrink-0">
                  {cert.date}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Skills ───────────────────────────────────────── */}
      <section>
        <SectionLabel>skills</SectionLabel>
        <div className="border-l-2 border-emerald-200 dark:border-emerald-800 pl-4 space-y-6">
          {skills.map((cat) => (
            <div key={cat.category}>
              <h3 className="mb-3">
                <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${skillCategoryColor[cat.category] ?? "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"}`}>
                  {cat.category}
                </span>
              </h3>
              <div className="space-y-2">
                {cat.items.map((skill) => (
                  <div key={skill.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400 shrink-0 w-40">
                      {skill.name}
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {skill.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────── */}
      <section>
        <SectionLabel>projects</SectionLabel>
        <div className="grid sm:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.category}
              href={`/projects/${project.category}`}
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden block"
            >
              {(project.thumbnail ?? project.architecture.diagram) && (
                <div className="w-full aspect-video bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.thumbnail ?? project.architecture.diagram}
                    alt={`${project.title} 썸네일`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${projectCategoryColor[project.category] ?? "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"}`}>
                    {project.category}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-neutral-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors mt-0.5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 leading-snug text-sm">
                  {project.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                  {project.overview.description}
                </p>
                <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{project.period}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Highlights ───────────────────────────────────── */}
      <section className="pb-8">
        <SectionLabel>highlights</SectionLabel>
        <div className="grid sm:grid-cols-3 gap-4">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`font-mono text-xs px-2 py-0.5 rounded ${categoryColor[h.category] ?? categoryColor["기타"]}`}>
                  {h.category}
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  {h.title}
                </h3>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400 w-8 pt-0.5">문제</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{h.problem}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400 w-8 pt-0.5">해결</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{h.action}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400 w-8 pt-0.5">결과</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{h.result}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
