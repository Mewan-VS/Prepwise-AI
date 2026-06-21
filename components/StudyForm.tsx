"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { StudyPlanDay } from "@/lib/supabase";
import PlanCard from "./PlanCard";

export default function StudyForm() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");

  const [plan, setPlan] = useState<StudyPlanDay[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setPlan(null);
    setGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topics, examDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate plan.");
      setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!plan) return;
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topics, examDate, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save plan.");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-indigo-900";

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleGenerate}
        className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Subject
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Organic Chemistry"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Topics
          </label>
          <textarea
            className={inputClass}
            placeholder="e.g. Alkanes, Alkenes, Reaction mechanisms, Isomerism"
            rows={3}
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Exam date
          </label>
          <input
            type="date"
            className={inputClass}
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={generating}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating ? "Generating your plan…" : "Generate study plan"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {plan && (
        <div className="space-y-4">
          <PlanCard
            subject={subject}
            topics={topics}
            examDate={examDate}
            plan={plan}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save this plan"}
            </button>
            {saved && (
              <a
                href="/plans"
                className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                View all saved plans →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
