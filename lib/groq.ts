import type { StudyPlanDay } from "./supabase";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

type GenerateArgs = {
  subject: string;
  topics: string;
  examDate: string;
};

/**
 * Calls the Groq LLM to produce a personalized day-by-day study plan.
 * Returns a structured array of study days. Throws on API / parsing errors.
 */
export async function generateStudyPlan({
  subject,
  topics,
  examDate,
}: GenerateArgs): Promise<StudyPlanDay[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in environment.");
  }

  const today = new Date().toISOString().split("T")[0];

  const systemPrompt =
    "You are PrepWise, an expert study coach. You build realistic, " +
    "encouraging, exam-focused study schedules. You always respond with " +
    "valid JSON only — no markdown, no commentary.";

  const userPrompt = `Create a personalized study schedule.

Subject: ${subject}
Topics to cover: ${topics}
Today's date: ${today}
Exam date: ${examDate}

Spread the topics sensibly across the days between today and the exam date,
leaving the final day or two for revision and practice. Return ONLY a JSON
object with this exact shape:

{
  "plan": [
    {
      "day": "Mon, 23 Jun (Day 1)",
      "focus": "Short title for the day",
      "tasks": ["task 1", "task 2", "task 3"]
    }
  ]
}

Each day should have a clear focus and 2-4 concrete, actionable tasks.`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq API error (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  let parsed: { plan?: StudyPlanDay[] };
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Could not parse the study plan returned by the model.");
  }

  if (!parsed.plan || !Array.isArray(parsed.plan)) {
    throw new Error("The model response did not contain a valid plan array.");
  }

  return parsed.plan;
}
