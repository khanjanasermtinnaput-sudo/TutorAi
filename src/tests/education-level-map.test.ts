import { test } from "node:test";
import assert from "node:assert/strict";
import { EDUCATION_LEVELS, educationLevelLabel, isValidEducationLevel } from "../lib/utils/education-level-map";

test("EDUCATION_LEVELS: every value is unique", () => {
  const values = EDUCATION_LEVELS.map((l) => l.value);
  assert.equal(new Set(values).size, values.length);
});

test("educationLevelLabel: known value returns Thai label", () => {
  assert.equal(educationLevelLabel("ม.3"), "มัธยมศึกษาปีที่ 3");
});

test("educationLevelLabel: unknown value falls back to the raw value", () => {
  assert.equal(educationLevelLabel("unknown"), "unknown");
});

test("isValidEducationLevel: true for a real level, false otherwise", () => {
  assert.equal(isValidEducationLevel("ม.6"), true);
  assert.equal(isValidEducationLevel("ม.7"), false);
});
