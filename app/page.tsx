import Link from "next/link";
import StudyForm from "@/components/StudyForm";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            PrepWise <span className="text-indigo-600">AI</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Your smart, personalized study planner.
          </p>
        </div>
        <Link
          href="/plans"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Saved plans
        </Link>
      </div>

      <StudyForm />
    </div>
  );
}
