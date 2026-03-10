import { describe, expect, it } from "vitest";

import { formatDateLabel } from "./date-utils";

describe("formatDateLabel", () => {
  it("formats ISO date to dd/mm/yyyy", () => {
    expect(formatDateLabel("2026-03-10")).toBe("10/03/2026");
  });

  it("returns original value on invalid input", () => {
    expect(formatDateLabel("texto")).toBe("texto");
  });
});
