import { notFound } from "next/navigation";
import Image from "next/image";
import { projects } from "@/data/en/projects";
import { profile } from "@/data/en/profile";
import { certifications } from "@/data/en/certifications";
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

export default async function PrintPageEn({ params }: { params: Promise<{ slug: string }> }) {
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

        {/* ── Profile Summary ──────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>Profile</PrintSectionTitle>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-4">
            {/* Education */}
            <div>
              <p className="font-semibold text-neutral-800">{profile.education.school}</p>
              <p className="text-neutral-600">{profile.education.major}</p>
              <p className="text-neutral-400 text-xs">{profile.education.period}</p>
              <p className="text-neutral-500 text-xs mt-0.5">
                GPA {profile.education.gpa} &nbsp;·&nbsp; Major GPA {profile.education.majorGpa}
              </p>
            </div>
            {/* Military Service */}
            {profile.militaryService && (
              <div>
                <p className="font-semibold text-neutral-800">{profile.militaryService.branch}</p>
                <p className="text-neutral-600">
                  {profile.militaryService.status === "completed"
                    ? "Honorably Discharged"
                    : profile.militaryService.status === "exempted"
                    ? "Military Exemption"
                    : "Currently Serving"}
                </p>
                <p className="text-neutral-400 text-xs">{profile.militaryService.period}</p>
              </div>
            )}
          </div>

          {/* Certifications — shown on print only */}
          {certifications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Certifications</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                {certifications.map((cert, i) => (
                  <div key={i}>
                    <span className="font-medium text-neutral-800">{cert.name}</span>
                    <span className="text-neutral-400 ml-2 text-xs">{cert.date}</span>
                    {cert.certNumber && (
                      <p className="text-xs text-neutral-400">No. {cert.certNumber}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Overview ─────────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>Overview</PrintSectionTitle>
          <p className="text-neutral-700 mb-2">{project.overview.description}</p>
          <p className="text-neutral-700">
            <span className="font-semibold text-neutral-900">Role: </span>
            {project.overview.role}
          </p>
        </section>

        {/* ── Architecture ─────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>Architecture</PrintSectionTitle>
          {project.architecture.diagram && (
            <div className="relative w-full aspect-video rounded bg-neutral-100 border border-neutral-200 mb-4 overflow-hidden">
              <Image
                src={project.architecture.diagram}
                alt="Architecture diagram"
                fill
                className="object-contain"
              />
            </div>
          )}
          <p className="text-neutral-700 mb-3">{project.architecture.description}</p>
          <div className="p-3 rounded border border-neutral-200 bg-neutral-50">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">Design Rationale</p>
            <p className="text-neutral-700">{project.architecture.reasoning}</p>
          </div>
        </section>

        {/* ── Tech Stack ───────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>Tech Stack</PrintSectionTitle>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th scope="col" className="text-left py-2 pr-4 font-semibold text-neutral-600 w-32">Technology</th>
                <th scope="col" className="text-left py-2 pr-4 font-semibold text-neutral-600 w-44">Role</th>
                <th scope="col" className="text-left py-2 font-semibold text-neutral-600">Why Chosen</th>
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
          <PrintSectionTitle>Problem Solving</PrintSectionTitle>
          <div className="space-y-6">
            {project.problemSolving.map((ps, i) => (
              <div key={i} className="print-break-avoid print-problem-item border border-neutral-200 rounded p-4">
                <dl className="space-y-2 text-sm">
                  <PrintDL label="Issue"    value={ps.issue} />
                  <PrintDL label="Analysis" value={ps.analysis} />
                  <PrintDL label="Solution" value={ps.solution} />
                  <PrintDL label="Result"   value={ps.result} bold />
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* ── Retrospective ────────────────────────────────── */}
        <section className="print-break-avoid">
          <PrintSectionTitle>Retrospective</PrintSectionTitle>
          <dl className="space-y-3 text-sm">
            <PrintDL label="Improvements" value={project.retrospective.improvements} />
            <PrintDL label="Regrets"      value={project.retrospective.regrets} />
            <PrintDL label="Next Steps"   value={project.retrospective.futureWork} />
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
      <dt className="shrink-0 font-semibold text-neutral-500 w-20">{label}</dt>
      <dd className={`text-neutral-700 leading-relaxed ${bold ? "font-medium" : ""}`}>{value}</dd>
    </div>
  );
}
