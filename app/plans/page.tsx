import Link from "next/link";
import { supabase, type StudyPlan } from "@/lib/supabase";
import PlanCard from "@/components/PlanCard";

// Always fetch fresh data from Supabase on each request.
export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const { data, error } = await supabase
    .from("study_plans")
    .select("*")
    .order("created_at", { ascending: false });

  const plans = (data ?? []) as StudyPlan[];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Saved plans
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            All your generated study schedules.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + New plan
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Could not load plans: {error.message}
        </p>
      )}

      {!error && plans.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No saved plans yet.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Generate your first plan →
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            subject={p.subject}
            topics={p.topics}
            examDate={p.exam_date}
            plan={p.plan}
            createdAt={p.created_at}
          />
        ))}
      </div>
    </div>
  );
}
