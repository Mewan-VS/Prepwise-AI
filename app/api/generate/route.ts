import { NextResponse } from "next/server";
import { generateStudyPlan } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subject = (body?.subject ?? "").toString().trim();
    const topics = (body?.topics ?? "").toString().trim();
    const examDate = (body?.examDate ?? "").toString().trim();

    if (!subject || !topics || !examDate) {
      return NextResponse.json(
        { error: "subject, topics and examDate are all required." },
        { status: 400 }
      );
    }

    const plan = await generateStudyPlan({ subject, topics, examDate });

    return NextResponse.json({ plan });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate study plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
