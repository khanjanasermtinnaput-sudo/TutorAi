import { test } from "node:test";
import assert from "node:assert/strict";
import { generateTopicSummary } from "../lib/ai/topic-summary-generator";
import type { RouteChatDeps } from "../lib/ai/ai-router";

async function* gen(...chunks: string[]): AsyncGenerator<string> {
  for (const c of chunks) yield c;
}

const validSummary = JSON.stringify({
  key_points: ["อนุพันธ์คืออัตราการเปลี่ยนแปลงของฟังก์ชัน"],
  formulas: [{ name: "กฎกำลัง", formula: "$\\frac{d}{dx}x^n = nx^{n-1}$", when_to_use: "ใช้หาอนุพันธ์ของพจน์ที่มีเลขชี้กำลัง" }],
  frequently_tested: ["โจทย์หาอนุพันธ์ของฟังก์ชันประกอบ มักออกสอบเพราะทดสอบความเข้าใจ chain rule"],
});

const baseParams = {
  subjectName: "คณิตศาสตร์",
  educationLevel: "ม.5",
  topic: "อนุพันธ์",
  sources: [],
  openRouterApiKey: "or-key",
  openRouterModel: "or-model",
  geminiApiKey: "g-key",
  geminiModel: "g-model",
};

test("generateTopicSummary: accepts a valid response", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => gen(validSummary),
    gemini: () => gen("unused"),
  };
  const result = await generateTopicSummary(baseParams, deps);
  assert.equal(result.provider, "openrouter");
  assert.equal(result.summary.key_points.length, 1);
  assert.equal(result.summary.formulas[0].name, "กฎกำลัง");
});

test("generateTopicSummary: rejects a response missing frequently_tested, then retries", async () => {
  const invalid = JSON.stringify({ key_points: ["x"], formulas: [] });
  let attempt = 0;
  const deps: RouteChatDeps = {
    openrouter: () => {
      attempt++;
      return attempt === 1 ? gen(invalid) : gen(validSummary);
    },
    gemini: () => gen("unused"),
  };
  const result = await generateTopicSummary(baseParams, deps);
  assert.equal(attempt, 2);
  assert.ok(result.summary.frequently_tested.length > 0);
});

test("generateTopicSummary: allows an empty formulas array (e.g. non-math topics)", async () => {
  const noFormulas = JSON.stringify({
    key_points: ["บทกวีนี้ใช้ภาพพจน์อุปมา"],
    formulas: [],
    frequently_tested: ["การวิเคราะห์ภาพพจน์ในบทกวี"],
  });
  const deps: RouteChatDeps = {
    openrouter: () => gen(noFormulas),
    gemini: () => gen("unused"),
  };
  const result = await generateTopicSummary(baseParams, deps);
  assert.deepEqual(result.summary.formulas, []);
});
