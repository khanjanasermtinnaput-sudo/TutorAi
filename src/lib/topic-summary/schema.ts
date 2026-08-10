import { z } from "zod";

export const formulaSchema = z.object({
  name: z.string().min(1),
  formula: z.string().min(1),
  when_to_use: z.string().min(1),
});

export const topicSummaryContentSchema = z.object({
  key_points: z.array(z.string().min(1)).min(1),
  formulas: z.array(formulaSchema),
  frequently_tested: z.array(z.string().min(1)),
});

export type Formula = z.infer<typeof formulaSchema>;
export type TopicSummaryContent = z.infer<typeof topicSummaryContentSchema>;
