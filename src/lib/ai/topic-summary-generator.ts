import { generateValidatedJson } from "./json-completion";
import type { RouteChatDeps, AiProvider } from "./ai-router";
import { buildTopicSummaryPrompt, TOPIC_SUMMARY_SYSTEM } from "./prompts/topic-summary";
import { topicSummaryContentSchema, type TopicSummaryContent } from "@/lib/topic-summary/schema";
import type { SearchResult } from "@/lib/google-search";

export interface GenerateTopicSummaryParams {
  subjectName: string;
  educationLevel: string;
  topic: string;
  sources: SearchResult[];
  openRouterApiKey?: string;
  openRouterModel?: string;
  geminiApiKey?: string;
  geminiModel?: string;
}

export interface GenerateTopicSummaryResult {
  summary: TopicSummaryContent;
  provider: AiProvider;
}

export async function generateTopicSummary(
  params: GenerateTopicSummaryParams,
  deps?: RouteChatDeps,
): Promise<GenerateTopicSummaryResult> {
  const result = await generateValidatedJson(
    {
      prompt: buildTopicSummaryPrompt(params),
      systemPrompt: TOPIC_SUMMARY_SYSTEM,
      schema: topicSummaryContentSchema,
      openRouterApiKey: params.openRouterApiKey,
      openRouterModel: params.openRouterModel,
      geminiApiKey: params.geminiApiKey,
      geminiModel: params.geminiModel,
    },
    deps,
  );
  return { summary: result.data, provider: result.provider };
}
