import { streamOpenRouterCompletion, type ChatMessage } from "./openrouter";
import { streamGeminiCompletion } from "./gemini";

export type AiProvider = "openrouter" | "gemini";

export interface RouteChatParams {
  messages: ChatMessage[];
  systemInstruction?: string;
  openRouterApiKey?: string;
  openRouterModel?: string;
  geminiApiKey?: string;
  geminiModel?: string;
  temperature?: number;
}

export interface RouteChatResult {
  provider: AiProvider;
  chunks: AsyncGenerator<string>;
}

type ProviderStreamFn = (params: RouteChatParams, signal?: AbortSignal) => AsyncGenerator<string>;

export interface RouteChatDeps {
  openrouter: ProviderStreamFn;
  gemini: ProviderStreamFn;
}

const DEFAULT_DEPS: RouteChatDeps = {
  openrouter: (params, signal) =>
    streamOpenRouterCompletion({
      apiKey: params.openRouterApiKey ?? "",
      model: params.openRouterModel ?? "",
      messages: params.systemInstruction
        ? [{ role: "system", content: params.systemInstruction }, ...params.messages]
        : params.messages,
      temperature: params.temperature,
      signal,
    }),
  gemini: (params, signal) =>
    streamGeminiCompletion({
      apiKey: params.geminiApiKey ?? "",
      model: params.geminiModel ?? "",
      systemInstruction: params.systemInstruction,
      messages: params.messages,
      signal,
    }),
};

const FIRST_CHUNK_TIMEOUT_MS = 15_000;

async function* prepend(first: string, rest: AsyncGenerator<string>): AsyncGenerator<string> {
  yield first;
  yield* rest;
}

/** Pulls the generator's first chunk under a timeout. Only once this succeeds
 * do we "commit" to a provider — matching the rule that a provider must never
 * be switched after any content has already reached the client. */
async function firstChunk(
  gen: AsyncGenerator<string>,
  timeoutMs: number,
  onTimeout: () => void,
): Promise<{ first: string; rest: AsyncGenerator<string> }> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      onTimeout();
      reject(new Error(`timed out waiting for first chunk after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  try {
    const result = await Promise.race([gen.next(), timeout]);
    if (result.done) throw new Error("provider stream ended with no content");
    return { first: result.value, rest: gen };
  } finally {
    clearTimeout(timer!);
  }
}

export class AllProvidersFailedError extends Error {
  constructor(
    public openRouterError: unknown,
    public geminiError: unknown,
  ) {
    super("Both OpenRouter and Gemini failed to produce a response");
    this.name = "AllProvidersFailedError";
  }
}

/** Tries OpenRouter first, falls back to Gemini only if OpenRouter fails or
 * times out BEFORE yielding any content. Throws AllProvidersFailedError if
 * both fail — the caller must surface this as a real error, never fabricate
 * an answer (master prompt §10). */
export async function routeChatCompletion(
  params: RouteChatParams,
  deps: RouteChatDeps = DEFAULT_DEPS,
): Promise<RouteChatResult> {
  const openRouterController = new AbortController();
  let openRouterError: unknown;

  if (params.openRouterApiKey && params.openRouterModel) {
    try {
      const gen = deps.openrouter(params, openRouterController.signal);
      const { first, rest } = await firstChunk(gen, FIRST_CHUNK_TIMEOUT_MS, () => openRouterController.abort());
      return { provider: "openrouter", chunks: prepend(first, rest) };
    } catch (err) {
      openRouterError = err;
    }
  } else {
    openRouterError = new Error("OpenRouter not configured (missing API key or model)");
  }

  if (!params.geminiApiKey || !params.geminiModel) {
    throw new AllProvidersFailedError(openRouterError, new Error("Gemini not configured (missing API key or model)"));
  }

  try {
    const gen = deps.gemini(params);
    const { first, rest } = await firstChunk(gen, FIRST_CHUNK_TIMEOUT_MS, () => {});
    return { provider: "gemini", chunks: prepend(first, rest) };
  } catch (geminiError) {
    throw new AllProvidersFailedError(openRouterError, geminiError);
  }
}

/** Drains a chunk generator into one string — for callers (quiz generation,
 * topic summaries) that need the complete response before doing anything
 * with it, rather than streaming it to a client. */
export async function collectChunks(gen: AsyncGenerator<string>): Promise<string> {
  let out = "";
  for await (const chunk of gen) out += chunk;
  return out;
}
