import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  latex: z.string().min(1).max(2000),
  label: z.string().max(200).optional(),
  source: z.enum(["manual", "chat", "quiz"]).default("manual"),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: formulas, error } = await supabase
    .from("saved_formulas")
    .select("id, latex, label, source, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "failed_to_load_formulas" }, { status: 500 });
  }

  return NextResponse.json({ formulas });
}

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 400 });
  }
  const { latex, label, source } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: formula, error } = await supabase
    .from("saved_formulas")
    .upsert({ user_id: user.id, latex, label, source }, { onConflict: "user_id,latex" })
    .select("id, latex, label, source, created_at")
    .single();
  if (error || !formula) {
    return NextResponse.json({ error: "failed_to_save_formula" }, { status: 500 });
  }

  return NextResponse.json({ formula }, { status: 201 });
}
