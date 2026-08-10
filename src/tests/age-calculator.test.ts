import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateAge } from "../lib/utils/age-calculator";

test("calculateAge: birthday already passed this year", () => {
  assert.equal(calculateAge("2010-01-15", new Date("2026-08-10")), 16);
});

test("calculateAge: birthday not yet reached this year", () => {
  assert.equal(calculateAge("2010-12-15", new Date("2026-08-10")), 15);
});

test("calculateAge: birthday is today", () => {
  assert.equal(calculateAge("2010-08-10", new Date("2026-08-10")), 16);
});

test("calculateAge: born earlier in the same month", () => {
  assert.equal(calculateAge("2010-08-01", new Date("2026-08-10")), 16);
});

test("calculateAge: born later in the same month", () => {
  assert.equal(calculateAge("2010-08-20", new Date("2026-08-10")), 15);
});
