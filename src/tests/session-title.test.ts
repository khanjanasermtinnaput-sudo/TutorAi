import { test } from "node:test";
import assert from "node:assert/strict";
import { generateSessionTitle } from "../lib/ai/session-title";
import type { RouteChatDeps } from "../lib/ai/ai-router";

async function* gen(...chunks: string[]): AsyncGenerator<string> {
  for (const c of chunks) yield c;
}

async function* throwing(message: string): AsyncGenerator<string> {
  throw new Error(message);
  // eslint-disable-next-line no-unreachable
  yield "";
}

const baseParams = {
  userMessage: "อนุพันธ์คืออะไร",
  assistantReply: "อนุพันธ์คืออัตราการเปลี่ยนแปลงของฟังก์ชัน...",
  openRouterApiKey: "or-key",
  openRouterModel: "or-model",
  geminiApiKey: "g-key",
  geminiModel: "g-model",
};

test("generateSessionTitle: strips quotes/whitespace from the provider's answer", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => gen('  "อนุพันธ์เบื้องต้น"  '),
    gemini: () => gen("unused"),
  };
  const title = await generateSessionTitle(baseParams, deps);
  assert.equal(title, "อนุพันธ์เบื้องต้น");
});

test("generateSessionTitle: truncates an overly long answer", async () => {
  const long = "ก".repeat(120);
  const deps: RouteChatDeps = {
    openrouter: () => gen(long),
    gemini: () => gen("unused"),
  };
  const title = await generateSessionTitle(baseParams, deps);
  assert.ok(title !== null);
  assert.equal(title!.length, 60);
});

test("generateSessionTitle: returns null (never throws) when both providers fail on both attempts", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => throwing("OpenRouter down"),
    gemini: () => throwing("Gemini down"),
  };
  const title = await generateSessionTitle(baseParams, deps, 0);
  assert.equal(title, null);
});

test("generateSessionTitle: retries once and succeeds after a transient failure", async () => {
  let calls = 0;
  const deps: RouteChatDeps = {
    openrouter: () => {
      calls += 1;
      if (calls === 1) return throwing("rate limited");
      return gen("อนุพันธ์เบื้องต้น");
    },
    gemini: () => throwing("Gemini down"),
  };
  const title = await generateSessionTitle(baseParams, deps, 0);
  assert.equal(title, "อนุพันธ์เบื้องต้น");
  assert.equal(calls, 2);
});

test("generateSessionTitle: returns null when the provider answers with only whitespace/quotes", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => gen('   ""   '),
    gemini: () => gen("unused"),
  };
  const title = await generateSessionTitle(baseParams, deps);
  assert.equal(title, null);
});
