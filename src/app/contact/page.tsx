import type { Metadata } from "next";
import { profile } from "@/data/profile";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "피드백이나 궁금한 점을 남겨주세요.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* 헤더 */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Contact</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          피드백이나 궁금한 점이 있으면 편하게 남겨주세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">

        {/* 왼쪽: 직접 연락 */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            궁금한 점 / 채용 문의
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
            채용, 협업, 기술적인 질문 등 무엇이든 편하게 연락 주세요.
            메일로 연락 주시면 빠르게 답변드리겠습니다.
          </p>

          <ul className="space-y-4">
            {profile.links.email && (
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-0.5">이메일</p>
                  <a
                    href={`mailto:${profile.links.email}`}
                    className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {profile.links.email}
                  </a>
                </div>
              </li>
            )}

            {profile.links.github && (
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-0.5">GitHub</p>
                  <a
                    href={profile.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {profile.links.github.replace("https://", "")}
                  </a>
                </div>
              </li>
            )}

            {profile.links.blog && (
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-0.5">Velog</p>
                  <a
                    href={profile.links.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {profile.links.blog.replace("https://", "")}
                  </a>
                </div>
              </li>
            )}
          </ul>
        </section>

        {/* 오른쪽: 피드백 폼 */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            피드백 남기기
          </h2>
          <FeedbackForm />
        </section>

      </div>
    </div>
  );
}
