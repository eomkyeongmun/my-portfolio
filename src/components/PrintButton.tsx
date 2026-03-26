"use client";

export function PrintButton() {
  return (
    <div className="no-print fixed top-4 right-4 z-50">
      <button
        onClick={() => window.print()}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
      >
        PDF 저장
      </button>
    </div>
  );
}
