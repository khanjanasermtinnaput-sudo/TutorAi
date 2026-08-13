/** Extracts unique `$...$` LaTeX bodies (delimiters stripped) from a block of text. */
export function extractLatexSnippets(text: string): string[] {
  const bodies = (text.match(/\$([^$\n]+)\$/g) ?? [])
    .map((m) => m.slice(1, -1).trim())
    .filter(Boolean);
  return Array.from(new Set(bodies));
}
