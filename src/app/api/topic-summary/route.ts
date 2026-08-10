import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateTopicSummary } from "@/lib/topic-summary/get-or-create";

const querySchema = z.object({
  subjectId: z.string().uuid(),
  topic: z.string().min(1).max(200),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    subjectId: searchParams.get("subjectId"),
    topic: searchParams.get("topic"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 400 });
  }
  const { subjectId, topic } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [{ data: profile }, { data: subject }] = await Promise.all([
    supabase.from("profiles").select("education_level").eq("id", user.id).single(),
    supabase.from("subjects").select("name").eq("id", subjectId).single(),
  ]);
  if (!profile) return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  if (!subject) return NextResponse.json({ error: "subject_not_found" }, { status: 404 });

  try {
    const result = await getOrCreateTopicSummary({
      subjectId,
      subjectName: subject.name,
      educationLevel: profile.education_level,
      topic,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[TutorAI] topic summary generation failed", err);
    return NextResponse.json(
      { error: "topic_summary_failed", message: "สรุปเนื้อหาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 502 },
    );
  }
}
