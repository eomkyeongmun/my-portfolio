"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { projects as koProjects } from "@/data/projects";
import { projects as enProjects } from "@/data/en/projects";

export function Header() {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [pdfOpen, setPdfOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectsDropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setPdfOpen(false), []);
  const closeProjectsDropdown = useCallback(() => setProjectsOpen(false), []);

  const isPrint = pathname.startsWith("/portfolio/print") || pathname.startsWith("/en/portfolio/print");
  if (isPrint) return null;

  const isEn = pathname.startsWith("/en");
  const projects = isEn ? enProjects : koProjects;
  const homeHref = isEn ? "/en" : "/";
  const projectHref = (slug: string) => isEn ? `/en/projects/${slug}` : `/projects/${slug}`;
  const printHref = (slug: string) => isEn ? `/en/portfolio/print/${slug}` : `/portfolio/print/${slug}`;
  const langToggleHref = isEn ? "/" : "/en";

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setPdfOpen(false);
      dropdownRef.current?.querySelector("button")?.focus();
    }
  };

  const handleProjectsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setProjectsOpen(false);
      projectsDropdownRef.current?.querySelector("button")?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href={homeHref}
          className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 rounded-sm"
        >
          Portfolio
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1">
          <Link
            href={homeHref}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 ${(isEn ? pathname === "/en" || pathname === "/en/" : pathname === "/")
                ? "text-neutral-900 dark:text-neutral-100 font-medium"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
          >
            Home
          </Link>
          <div className="relative" ref={projectsDropdownRef} onKeyDown={handleProjectsKeyDown}>
            <button
              onClick={() => setProjectsOpen((v) => !v)}
              onBlur={() => setTimeout(closeProjectsDropdown, 150)}
              aria-haspopup="menu"
              aria-expanded={projectsOpen}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 ${pathname.startsWith("/projects")
                  ? "text-neutral-900 dark:text-neutral-100 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
            >
              Projects
              <svg aria-hidden="true" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {projectsOpen && (
              <div
                role="menu"
                aria-label="Project list"
                className="absolute right-0 mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden"
              >
                {projects.map((p) => (
                  <Link
                    key={p.category}
                    href={projectHref(p.category)}
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
                    onClick={closeProjectsDropdown}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100 ${pathname === "/contact" || pathname === "/contact/"
                ? "text-neutral-900 dark:text-neutral-100 font-medium"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
          >
            Contact
          </Link>

          {/* Language toggle */}
          <Link
            href={langToggleHref}
            aria-label={isEn ? "한국어로 보기" : "View in English"}
            className="px-2.5 py-1 text-xs font-mono rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
          >
            {isEn ? "KO" : "EN"}
          </Link>

          {/* PDF dropdown */}
          <div className="relative" ref={dropdownRef} onKeyDown={handleDropdownKeyDown}>
            <button
              onClick={() => setPdfOpen((v) => !v)}
              onBlur={() => setTimeout(closeDropdown, 150)}
              aria-haspopup="menu"
              aria-expanded={pdfOpen}
              aria-label="PDF download menu"
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
            >
              PDF
              <svg aria-hidden="true" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {pdfOpen && (
              <div
                role="menu"
                aria-label="PDF download list"
                className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden"
              >
                {isEn && (
                  <>
                    <Link
                      href="/en/portfolio/print/resume"
                      target="_blank"
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
                      onClick={closeDropdown}
                    >
                      <span className="text-xs">★</span> Resume (Full)
                    </Link>
                    <div className="border-t border-neutral-100 dark:border-neutral-800" />
                  </>
                )}
                {projects.map((p) => (
                  <Link
                    key={p.category}
                    href={printHref(p.category)}
                    target="_blank"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
                    onClick={closeDropdown}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
            className="ml-1 p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
          >
            {theme === "dark" ? (
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
