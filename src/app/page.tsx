import Link from "next/link";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { highlights } from "@/data/highlights";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";

const categoryColor: Record<string, string> = {
  장애대응: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CICD: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  모니터링: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  비용최적화: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  트래픽: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  성능개선: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  기타: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-24">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
          {profile.name}
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-6">
          {profile.title}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {profile.keywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 text-sm rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
            >
              {kw}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.links.github && (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 rounded-lg"
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 rounded-lg"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
              </svg>
              Blog
            </a>
          )}
          {profile.links.email && (
            <a
              href={`mailto:${profile.links.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 rounded-lg"
            >
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          )}
        </div>
      </section>

      {/* ── Summary ──────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mb-4">
          About
        </h2>
        <p className="text-lg leading-8 text-neutral-700 dark:text-neutral-300">
          {profile.summary}
        </p>
      </section>

      {/* ── Skills ───────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mb-6">
          Skills
        </h2>
        <div className="space-y-8">
          {skills.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                {cat.category}
              </h3>
              <div className="space-y-2">
                {cat.items.map((skill) => (
                  <div key={skill.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 shrink-0 w-40">
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
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mb-6">
          Projects
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.category}
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors bg-neutral-50 dark:bg-neutral-900/50 overflow-hidden"
            >
              <Link
                href={`/projects/${project.category}`}
                className="block p-6 pb-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    {project.category}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors mt-0.5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 leading-snug">
                  {project.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                  {project.overview.description}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">{project.period}</p>
              </Link>
              <div className="px-6 pb-5">
                <PdfDownloadButton slug={project.category} projectTitle={project.title} variant="outline" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Highlights ───────────────────────────────────── */}
      <section className="pb-8">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mb-6">
          Highlights
        </h2>
        <div className="space-y-6">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColor[h.category] ?? categoryColor["기타"]}`}>
                  {h.category}
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  {h.title}
                </h3>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-neutral-400 dark:text-neutral-500 w-12">문제</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{h.problem}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-neutral-400 dark:text-neutral-500 w-12">해결</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{h.action}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-neutral-400 dark:text-neutral-500 w-12">결과</dt>
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
