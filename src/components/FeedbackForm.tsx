"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_FEEDBACK_API_URL ?? "";
      const res = await fetch(`${apiBase}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "전송 중 오류가 발생했습니다.");
    }
  }

  return (
    <section className="mt-16 border-t border-neutral-200 dark:border-neutral-700 pt-12">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">피드백</h2>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">
        방문해 주셔서 감사합니다. 자유롭게 의견을 남겨주세요.
      </p>

      {status === "success" ? (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 text-emerald-700 dark:text-emerald-300">
          <p className="font-semibold">피드백을 보내주셔서 감사합니다!</p>
          <p className="text-sm mt-1">소중한 의견 잘 받았습니다.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-sm underline underline-offset-2 hover:text-emerald-900 dark:hover:text-emerald-100"
          >
            다시 작성하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="fb-name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                이름 <span className="text-neutral-400 font-normal">(선택)</span>
              </label>
              <input
                id="fb-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="홍길동"
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="fb-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                이메일 <span className="text-neutral-400 font-normal">(선택)</span>
              </label>
              <input
                id="fb-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                placeholder="example@email.com"
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="fb-message" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              메시지 <span className="text-neutral-600 dark:text-neutral-400">*</span>
            </label>
            <textarea
              id="fb-message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              rows={5}
              placeholder="자유롭게 의견을 남겨주세요."
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
            />
            <p className="mt-1 text-xs text-neutral-400 text-right">{message.length} / 2000</p>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "sending" || !message.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 text-sm font-semibold text-white transition-colors"
          >
            {status === "sending" ? "전송 중…" : "피드백 보내기"}
          </button>
        </form>
      )}
    </section>
  );
}
