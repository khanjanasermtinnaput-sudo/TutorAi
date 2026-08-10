/** Reads a fetch Response body as newline-delimited SSE, yielding each
 * event's raw `data:` payload. Shared by openrouter.ts and gemini.ts — their
 * wire formats differ only in how they parse that payload, not in framing. */
export async function* readSseDataLines(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        yield trimmed.slice(5).trim();
      }
    }
  } finally {
    reader.releaseLock();
  }
}
