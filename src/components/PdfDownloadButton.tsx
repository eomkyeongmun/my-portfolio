"use client";

import { useState } from "react";

interface Props {
  slug: string;
  projectTitle: string;
  variant?: "default" | "outline" | "icon";
  lang?: "ko" | "en";
}

const t = {
  ko: {
    noUrl: "PDF API URL이 설정되지 않았습니다.",
    failed: "PDF 생성에 실패했습니다.",
    error: "PDF 다운로드 중 오류가 발생했습니다.",
    busy: "PDF 생성 중입니다. 잠시 기다려 주세요.",
    download: "PDF 다운로드",
    generating: "생성 중…",
    suffix: "_포트폴리오.pdf",
  },
  en: {
    noUrl: "PDF API URL is not configured.",
    failed: "Failed to generate the PDF.",
    error: "Something went wrong while downloading the PDF.",
    busy: "Generating the PDF. This may take a moment.",
    download: "Download PDF",
    generating: "Generating…",
    suffix: "_portfolio.pdf",
  },
} as const;

export function PdfDownloadButton({ slug, projectTitle, variant = "default", lang = "ko" }: Props) {
  const [loading, setLoading] = useState(false);
  const c = t[lang];

  const handleDownload = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_PDF_API_URL;
      if (!apiUrl) {
        throw new Error(c.noUrl);
      }
      const res = await fetch(`${apiUrl}/api/pdf/${slug}`);
      if (!res.ok) throw new Error(c.failed);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectTitle}${c.suffix}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : c.error);
    } finally {
      setLoading(false);
    }
  };

  const label = loading ? c.busy : c.download;

  if (variant === "icon") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        title={label}
        aria-label={`${projectTitle} — ${label}`}
        aria-busy={loading}
        className="shrink-0 p-1.5 rounded-md text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
      >
        {loading ? (
          <svg aria-hidden="true" className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={3} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        )}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        onClick={handleDownload}
        disabled={loading}
        aria-label={label}
        aria-busy={loading}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
      >
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <span aria-live="polite">{loading ? c.generating : c.download}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      aria-label={label}
      aria-busy={loading}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
    >
      <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <span aria-live="polite">{loading ? c.generating : c.download}</span>
    </button>
  );
}
