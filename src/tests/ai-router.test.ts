import { test } from "node:test";
import assert from "node:assert/strict";
import { routeChatCompletion, AllProvidersFailedError, type RouteChatDeps } from "../lib/ai/ai-router";

async function* gen(...chunks: string[]): AsyncGenerator<string> {
  for (const c of chunks) yield c;
}

async function* throwing(message: string): AsyncGenerator<string> {
  throw new Error(message);
  // eslint-disable-next-line no-unreachable
  yield "";
}

async function collect(g: AsyncGenerator<string>): Promise<string> {
  let out = "";
  for await (const chunk of g) out += chunk;
  return out;
}

const baseParams = {
  messages: [{ role: "user" as const, content: "hi" }],
  openRouterApiKey: "or-key",
  openRouterModel: "or-model",
  geminiApiKey: "g-key",
  geminiModel: "g-model",
};

test("ai-router: uses OpenRouter when it succeeds", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => gen("hello", " world"),
    gemini: () => gen("should not be called"),
  };
  const result = await routeChatCompletion(baseParams, deps);
  assert.equal(result.provider, "openrouter");
  assert.equal(await collect(result.chunks), "hello world");
});

test("ai-router: falls back to Gemini when OpenRouter throws before any content", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => throwing("OpenRouter down"),
    gemini: () => gen("gemini answer"),
  };
  const result = await routeChatCompletion(baseParams, deps);
  assert.equal(result.provider, "gemini");
  assert.equal(await collect(result.chunks), "gemini answer");
});

test("ai-router: falls back to Gemini when OpenRouter's stream ends with no content", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => gen(), // empty stream, no chunks at all
    gemini: () => gen("gemini answer"),
  };
  const result = await routeChatCompletion(baseParams, deps);
  assert.equal(result.provider, "gemini");
});

test("ai-router: throws AllProvidersFailedError when both providers fail", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => throwing("OpenRouter down"),
    gemini: () => throwing("Gemini down"),
  };
  await assert.rejects(() => routeChatCompletion(baseParams, deps), AllProvidersFailedError);
});

test("ai-router: skips straight to Gemini when OpenRouter isn't configured", async () => {
  let openrouterCalled = false;
  const deps: RouteChatDeps = {
    openrouter: () => {
      openrouterCalled = true;
      return gen("unused");
    },
    gemini: () => gen("gemini only"),
  };
  const result = await routeChatCompletion({ ...baseParams, openRouterApiKey: undefined }, deps);
  assert.equal(result.provider, "gemini");
  assert.equal(openrouterCalled, false);
});

test("ai-router: throws AllProvidersFailedError when neither provider is configured", async () => {
  const deps: RouteChatDeps = {
    openrouter: () => gen("unused"),
    gemini: () => gen("unused"),
  };
  await assert.rejects(
    () => routeChatCompletion({ messages: baseParams.messages }, deps),
    AllProvidersFailedError,
  );
});
