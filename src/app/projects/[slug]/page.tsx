import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.category }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.category === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.overview.description,
    openGraph: {
      title: project.title,
      description: project.overview.description,
    },
  };
}

const categoryColor: Record<string, string> = {
  backend:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  infrastructure: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  devops:         "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const retroConfig: Record<string, { border: string; label: string; icon: string }> = {
  "개선점":    { border: "border-t-amber-400 dark:border-t-amber-500",  label: "text-amber-700 dark:text-amber-400",  icon: "⚙" },
  "아쉬운 점": { border: "border-t-rose-400 dark:border-t-rose-500",    label: "text-rose-700 dark:text-rose-400",    icon: "△" },
  "향후 방향": { border: "border-t-blue-400 dark:border-t-blue-500",    label: "text-blue-700 dark:text-blue-400",    icon: "→" },
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.category === slug);
  if (!project) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-20">

      {/* ── Back ─────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 rounded-sm"
      >
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        홈으로
      </Link>

      {/* ── Overview ─────────────────────────────────────── */}
      <section>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${categoryColor[project.category] ?? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"}`}>
            {project.category}
          </span>
          <span className="font-mono text-sm text-neutral-400 dark:text-neutral-500">{project.period}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
          {project.title}
        </h1>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5 space-y-3 text-base leading-7 text-neutral-700 dark:text-neutral-300">
          <p>{project.overview.description}</p>
          <hr className="border-neutral-200 dark:border-neutral-700" />
          <p>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">담당 역할: </span>
            {project.overview.role}
          </p>
        </div>
        {/* Links */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 rounded-sm">
              <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          )}
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Demo
            </a>
          )}
          {project.links.blog && (
            <a href={project.links.blog} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Blog
            </a>
          )}
          <PdfDownloadButton slug={project.category} projectTitle={project.title} variant="outline" />
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────── */}
      <section>
        <SectionTitle>아키텍처</SectionTitle>
        {project.architecture.diagram && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-6">
            <Image
              src={project.architecture.diagram}
              alt="아키텍처 구성도"
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="space-y-4 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
          <p>{project.architecture.description}</p>
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-emerald-400 dark:border-l-emerald-600">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">설계 근거</p>
            <p>{project.architecture.reasoning}</p>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────── */}
      <section>
        <SectionTitle>기술 스택</SectionTitle>
        <div className="space-y-3">
          {project.techStack.map((tech) => (
            <div key={tech.name} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 border-l-4 border-l-neutral-300 dark:border-l-neutral-600">
              <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{tech.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{tech.role}</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{tech.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem Solving ──────────────────────────────── */}
      <section>
        <SectionTitle>문제 해결 경험</SectionTitle>
        <div className="space-y-8">
          {project.problemSolving.map((ps, i) => (
            <div key={i} className="relative pl-6 border-l-2 border-emerald-200 dark:border-emerald-800">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">이슈</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{ps.issue}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">분석</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{ps.analysis}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">해결</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{ps.solution}</dd>
                </div>
                <div className="pt-1">
                  <dt className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">결과</dt>
                  <dd className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">{ps.result}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* ── Retrospective ────────────────────────────────── */}
      <section className="pb-8">
        <SectionTitle>회고</SectionTitle>
        <div className="grid sm:grid-cols-3 gap-4">
          <RetroCard label="개선점" value={project.retrospective.improvements} />
          <RetroCard label="아쉬운 점" value={project.retrospective.regrets} />
          <RetroCard label="향후 방향" value={project.retrospective.futureWork} />
        </div>
      </section>

    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="font-mono text-neutral-400 dark:text-neutral-500 text-sm select-none">{"// "}</span>
      <span className="font-mono text-xs font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
        {children}
      </span>
    </div>
  );
}

function RetroCard({ label, value }: { label: string; value: string }) {
  const config = retroConfig[label] ?? { border: "border-t-neutral-400", label: "text-neutral-500", icon: "·" };
  return (
    <div className={`p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 border-t-2 ${config.border}`}>
      <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${config.label}`}>
        {config.icon} {label}
      </p>
      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{value}</p>
    </div>
  );
}
