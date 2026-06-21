import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/plans — list saved study plans (newest first)
export async function GET() {
  const { data, error } = await supabase
    .from("study_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plans: data });
}

// POST /api/plans — save a generated study plan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subject = (body?.subject ?? "").toString().trim();
    const topics = (body?.topics ?? "").toString().trim();
    const examDate = (body?.examDate ?? "").toString().trim();
    const plan = body?.plan;

    if (!subject || !topics || !examDate || !Array.isArray(plan)) {
      return NextResponse.json(
        { error: "subject, topics, examDate and plan are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("study_plans")
      .insert({ subject, topics, exam_date: examDate, plan })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ plan: data }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save study plan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
