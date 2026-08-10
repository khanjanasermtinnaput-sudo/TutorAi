import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { searchGoogle, type SearchResult } from "@/lib/google-search";
import { generateTopicSummary } from "@/lib/ai/topic-summary-generator";
import type { TopicSummaryContent } from "./schema";

export interface TopicSummaryResult {
  content: TopicSummaryContent;
  sources: SearchResult[];
  cached: boolean;
}

export interface GetOrCreateTopicSummaryParams {
  subjectId: string;
  subjectName: string;
  educationLevel: string;
  topic: string;
}

/** Cache-first per master prompt §5.5: check topic_summaries on
 * (subject_id, topic, education_level) before calling Google Search + the
 * AI at all. Written via the service-role client — topic_summaries is a
 * shared cache, not user-owned data, so no per-user RLS insert policy
 * exists for it (only the read policy does). */
export async function getOrCreateTopicSummary(params: GetOrCreateTopicSummaryParams): Promise<TopicSummaryResult> {
  const supabase = await createClient();
  const { data: cached } = await supabase
    .from("topic_summaries")
    .select("summary_content, sources")
    .eq("subject_id", params.subjectId)
    .eq("topic", params.topic)
    .eq("education_level", params.educationLevel)
    .maybeSingle();

  if (cached) {
    return {
      content: cached.summary_content as unknown as TopicSummaryContent,
      sources: (cached.sources as unknown as SearchResult[]) ?? [],
      cached: true,
    };
  }

  let sources: SearchResult[] = [];
  const searchApiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  if (searchApiKey && searchEngineId) {
    try {
      sources = await searchGoogle(`${params.topic} ${params.subjectName}`, searchApiKey, searchEngineId);
    } catch (err) {
      console.error("[TutorAI] Google Search failed, summarizing without sources", err);
    }
  }

  const generated = await generateTopicSummary({
    subjectName: params.subjectName,
    educationLevel: params.educationLevel,
    topic: params.topic,
    sources,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    openRouterModel: process.env.OPENROUTER_MODEL,
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  });

  const serviceClient = await createServiceRoleClient();
  // upsert (not insert) — two concurrent requests for the same uncached
  // topic would otherwise race on the unique (subject_id, topic,
  // education_level) constraint.
  await serviceClient.from("topic_summaries").upsert(
    {
      subject_id: params.subjectId,
      topic: params.topic,
      education_level: params.educationLevel,
      summary_content: generated.summary,
      sources: sources as unknown as never,
    },
    { onConflict: "subject_id,topic,education_level" },
  );

  return { content: generated.summary, sources, cached: false };
}
