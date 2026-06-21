import type { StudyPlan, StudyPlanDay } from "@/lib/supabase";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type PlanCardProps = {
  subject: string;
  topics: string;
  examDate: string;
  plan: StudyPlanDay[];
  createdAt?: string;
};

/**
 * Presentational card that renders a single study plan and its day-by-day
 * schedule. Used both for freshly generated plans and saved ones.
 */
export default function PlanCard({
  subject,
  topics,
  examDate,
  plan,
  createdAt,
}: PlanCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {subject}
          </h3>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Exam: {formatDate(examDate)}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Topics: {topics}
        </p>
        {createdAt && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Saved {formatDate(createdAt)}
          </p>
        )}
      </header>

      <ol className="space-y-3">
        {plan.map((day, i) => (
          <li
            key={i}
            className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {day.day}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {day.focus}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
              {day.tasks?.map((task, j) => (
                <li key={j}>{task}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </article>
  );
}

export type { StudyPlan };
