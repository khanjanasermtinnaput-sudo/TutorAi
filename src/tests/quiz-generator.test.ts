import { test } from "node:test";
import assert from "node:assert/strict";
import { generateQuiz } from "../lib/ai/quiz-generator";
import type { RouteChatDeps } from "../lib/ai/ai-router";

async function* gen(...chunks: string[]): AsyncGenerator<string> {
  for (const c of chunks) yield c;
}

const validQuiz = JSON.stringify({
  questions: [
    {
      question_text: "2 + 2 เท่ากับเท่าไร",
      choices: { A: "3", B: "4", C: "5", D: "6" },
      correct_choice: "B",
      explanation: "บวกเลข 2 กับ 2 ทีละหลัก ได้ผลลัพธ์เป็น 4 ตามหลักการบวกจำนวนเต็มพื้นฐาน",
    },
  ],
});

const baseParams = {
  subjectName: "คณิตศาสตร์",
  educationLevel: "ม.1",
  topic: "การบวกเลข",
  difficulty: "easy" as const,
  questionCount: 10,
  openRouterApiKey: "or-key",
  openRouterModel: "or-model",
  geminiApiKey: "g-key",
  geminiModel: "g-model",
};

test("generateQuiz: accepts a valid response on the first attempt", async () => {
  let calls = 0;
  const deps: RouteChatDeps = {
    openrouter: () => {
      calls++;
      return gen(validQuiz);
    },
    gemini: () => gen("unused"),
  };
  const result = await generateQuiz(baseParams, deps);
  assert.equal(result.provider, "openrouter");
  assert.equal(result.quiz.questions.length, 1);
  assert.equal(calls, 1);
});

test("generateQuiz: retries once on invalid JSON, then succeeds", async () => {
  let attempt = 0;
  const deps: RouteChatDeps = {
    openrouter: () => {
      attempt++;
      return attempt === 1 ? gen("this is not json") : gen(validQuiz);
    },
    gemini: () => gen("unused"),
  };
  const result = await generateQuiz(baseParams, deps);
  assert.equal(attempt, 2);
  assert.equal(result.quiz.questions.length, 1);
});

test("generateQuiz: rejects an explanation that's just the answer, then retries", async () => {
  const shortExplanation = JSON.stringify({
    questions: [
      {
        question_text: "2 + 2 เท่ากับเท่าไร",
        choices: { A: "3", B: "4", C: "5", D: "6" },
        correct_choice: "B",
        explanation: "คำตอบคือ B",
      },
    ],
  });
  let attempt = 0;
  const deps: RouteChatDeps = {
    openrouter: () => {
      attempt++;
      return attempt === 1 ? gen(shortExplanation) : gen(validQuiz);
    },
    gemini: () => gen("unused"),
  };
  const result = await generateQuiz(baseParams, deps);
  assert.equal(attempt, 2);
  assert.equal(result.quiz.questions[0].explanation, "บวกเลข 2 กับ 2 ทีละหลัก ได้ผลลัพธ์เป็น 4 ตามหลักการบวกจำนวนเต็มพื้นฐาน");
});

test("generateQuiz: throws after exhausting retries on persistently invalid output", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => gen("still not json"),
    gemini: () => gen("still not json either"),
  };
  await assert.rejects(() => generateQuiz(baseParams, deps), /AI failed to produce a valid quiz/);
});

test("generateQuiz: strips markdown code fences before parsing", async () => {
  const fenced = "```json\n" + validQuiz + "\n```";
  const deps: RouteChatDeps = {
    openrouter: () => gen(fenced),
    gemini: () => gen("unused"),
  };
  const result = await generateQuiz(baseParams, deps);
  assert.equal(result.quiz.questions.length, 1);
});
