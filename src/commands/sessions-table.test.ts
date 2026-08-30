// Sessions table tests cover shared fixed-width cell formatting.
import { describe, expect, it } from "vitest";
import { formatSessionKeyCell, SESSION_KEY_PAD, toSessionDisplayRow } from "./sessions-table.js";
import type { SessionEntry } from "../config/sessions.js";

describe("formatSessionKeyCell", () => {
  it("keeps both truncation boundaries UTF-16 safe", () => {
    const key = `${"a".repeat(15)}😀middle😀${"z".repeat(5)}`;

    const rendered = formatSessionKeyCell(key, false);

    expect(rendered).toBe(`${"a".repeat(15)}...${"z".repeat(5)}`.padEnd(SESSION_KEY_PAD));
    expect(rendered).toHaveLength(SESSION_KEY_PAD);
  });
});

describe("toSessionDisplayRow", () => {
  it("includes category when present on session entry", () => {
    const entry: SessionEntry = {
      type: "session-info",
      id: "test-session-id",
      sessionId: "test-session-id",
      category: "work",
      createdAt: Date.now() - 60000,
    } as unknown as SessionEntry;

    const row = toSessionDisplayRow("agent:main:test-session-id", entry);
    expect(row.category).toBe("work");
  });

  it("omits category when not present on session entry", () => {
    const entry: SessionEntry = {
      type: "session-info",
      id: "test-session-id",
      sessionId: "test-session-id",
      createdAt: Date.now() - 60000,
    } as unknown as SessionEntry;

    const row = toSessionDisplayRow("agent:main:test-session-id", entry);
    expect(row.category).toBeUndefined();
  });
});