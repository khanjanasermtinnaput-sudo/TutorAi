import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateTopicSummary } from "@/lib/topic-summary/get-or-create";
import { KeyPointsSummary } from "@/components/topic/KeyPointsSummary";
import { FormulaList } from "@/components/topic/FormulaList";
import { FrequentlyTestedList } from "@/components/topic/FrequentlyTestedBadge";
import { GlassCard } from "@/components/glass/GlassCard";

export default async function TopicPage({
  params,
}: {
  params: { subjectId: string; topic: string };
}) {
  const topic = decodeURIComponent(params.topic);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: subject }] = await Promise.all([
    supabase.from("profiles").select("education_level").eq("id", user.id).single(),
    supabase.from("subjects").select("name").eq("id", params.subjectId).single(),
  ]);
  if (!profile || !subject) notFound();

  let result;
  try {
    result = await getOrCreateTopicSummary({
      subjectId: params.subjectId,
      subjectName: subject.name,
      educationLevel: profile.education_level,
      topic,
    });
  } catch {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <GlassCard tint="error" className="p-6 text-center text-ink-primary">
          สรุปเนื้อหาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 overflow-y-auto p-4">
      <div>
        <p className="text-sm text-ink-secondary">{subject.name}</p>
        <h1 className="font-display text-heading-lg font-bold text-ink-primary">{topic}</h1>
      </div>

      <KeyPointsSummary points={result.content.key_points} />
      <FormulaList formulas={result.content.formulas} />
      <FrequentlyTestedList items={result.content.frequently_tested} />

      {result.sources.length > 0 && (
        <div>
          <h2 className="mb-2 font-display text-sm font-semibold text-ink-muted">แหล่งอ้างอิง</h2>
          <div className="flex flex-wrap gap-2">
            {result.sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-surface rounded-full px-3 py-1 text-xs text-ink-secondary hover:text-accent-primary"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
