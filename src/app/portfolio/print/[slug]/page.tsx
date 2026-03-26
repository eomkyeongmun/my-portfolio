import { notFound } from "next/navigation";
import Image from "next/image";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { PrintButton } from "@/components/PrintButton";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.category }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.category === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${profile.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function PrintPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.category === slug);
  if (!project) notFound();

  return (
    <div className="bg-white text-neutral-900 print:text-black font-sans">
      {/* Print button — hidden when printing */}
      <PrintButton />

      <div className="max-w-[210mm] mx-auto px-[14mm] py-[16mm] space-y-10 text-[11pt] leading-relaxed">

        {/* ── Header ───────────────────────────────────────── */}
        <header className="border-b border-neutral-300 pb-6 print-break-avoid">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">{project.category} Project</p>
              <h1 className="text-2xl font-bold text-neutral-900 leading-tight mb-1">{project.title}</h1>
              <p className="text-sm text-neutral-500">{project.period}</p>
            </div>
            <div className="text-right text-sm text-neutral-500 space-y-0.5">
              <p className="font-semibold text-neutral-800">{profile.name}</p>
              {profile.links.email && <p>{profile.links.email}</p>}
              {profile.links.github && <p>{profile.links.github}</p>}
            </div>
          </div>
        </header>

        {/* ── Overview ─────────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>개요</PrintSectionTitle>
          <p className="text-neutral-700 mb-2">{project.overview.description}</p>
          <p className="text-neutral-700">
            <span className="font-semibold text-neutral-900">담당 역할: </span>
            {project.overview.role}
          </p>
        </section>

        {/* ── Architecture ─────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>아키텍처</PrintSectionTitle>
          {project.architecture.diagram && (
            <div className="relative w-full aspect-video rounded bg-neutral-100 border border-neutral-200 mb-4 overflow-hidden">
              <Image
                src={project.architecture.diagram}
                alt="아키텍처 구성도"
                fill
                className="object-contain"
              />
            </div>
          )}
          <p className="text-neutral-700 mb-3">{project.architecture.description}</p>
          <div className="p-3 rounded border border-neutral-200 bg-neutral-50">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">설계 근거</p>
            <p className="text-neutral-700">{project.architecture.reasoning}</p>
          </div>
        </section>

        {/* ── Tech Stack ───────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>기술 스택</PrintSectionTitle>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th scope="col" className="text-left py-2 pr-4 font-semibold text-neutral-600 w-32">기술</th>
                <th scope="col" className="text-left py-2 pr-4 font-semibold text-neutral-600 w-44">역할</th>
                <th scope="col" className="text-left py-2 font-semibold text-neutral-600">선택 이유</th>
              </tr>
            </thead>
            <tbody>
              {project.techStack.map((tech) => (
                <tr key={tech.name} className="border-b border-neutral-100">
                  <td className="py-2 pr-4 font-medium text-neutral-800 align-top">{tech.name}</td>
                  <td className="py-2 pr-4 text-neutral-600 align-top">{tech.role}</td>
                  <td className="py-2 text-neutral-600 align-top">{tech.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── Problem Solving ──────────────────────────────── */}
        <section>
          <PrintSectionTitle>문제 해결 경험</PrintSectionTitle>
          <div className="space-y-6">
            {project.problemSolving.map((ps, i) => (
              <div key={i} className="print-break-avoid print-problem-item border border-neutral-200 rounded p-4">
                <dl className="space-y-2 text-sm">
                  <PrintDL label="이슈" value={ps.issue} />
                  <PrintDL label="분석" value={ps.analysis} />
                  <PrintDL label="해결" value={ps.solution} />
                  <PrintDL label="결과" value={ps.result} bold />
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* ── Retrospective ────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>회고</PrintSectionTitle>
          <dl className="space-y-3 text-sm">
            <PrintDL label="개선점" value={project.retrospective.improvements} />
            <PrintDL label="아쉬운 점" value={project.retrospective.regrets} />
            <PrintDL label="향후 방향" value={project.retrospective.futureWork} />
          </dl>
        </section>

      </div>
    </div>
  );
}

function PrintSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 border-b border-neutral-200 pb-1.5 mb-4">
      {children}
    </h2>
  );
}

function PrintDL({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex gap-3">
      <dt className="shrink-0 font-semibold text-neutral-500 w-14">{label}</dt>
      <dd className={`text-neutral-700 leading-relaxed ${bold ? "font-medium" : ""}`}>{value}</dd>
    </div>
  );
}
