import { test } from "node:test";
import assert from "node:assert/strict";
import { extractLatexSnippets } from "../lib/formula/extractLatexSnippets";

test("extractLatexSnippets: extracts a single formula body without delimiters", () => {
  assert.deepEqual(extractLatexSnippets("ตามสูตร $F = ma$ นะครับ"), ["F = ma"]);
});

test("extractLatexSnippets: extracts multiple distinct formulas in order", () => {
  assert.deepEqual(extractLatexSnippets("$E = mc^2$ และ $v = \\frac{d}{t}$"), ["E = mc^2", "v = \\frac{d}{t}"]);
});

test("extractLatexSnippets: dedupes repeated formulas", () => {
  assert.deepEqual(extractLatexSnippets("$x^2$ ... อีกครั้ง $x^2$"), ["x^2"]);
});

test("extractLatexSnippets: returns an empty array when there's no formula", () => {
  assert.deepEqual(extractLatexSnippets("ข้อความธรรมดา ไม่มีสูตร"), []);
});

test("extractLatexSnippets: ignores an unmatched dollar sign", () => {
  assert.deepEqual(extractLatexSnippets("ราคา $100 เท่านั้น"), []);
});
