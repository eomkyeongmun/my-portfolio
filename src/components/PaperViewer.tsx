interface Props {
  pdf: string;
  title: string;
  viewLabel?: string;
  downloadLabel?: string;
}

export function PaperViewer({
  pdf,
  title,
  viewLabel = "논문 보기",
  downloadLabel = "다운로드",
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-2.5">
      <a
        href={pdf}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 rounded-sm"
      >
        <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {viewLabel}
      </a>
      <a
        href={pdf}
        download
        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
      >
        <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {downloadLabel}
      </a>
    </div>
  );
}
