import { describe, expect, it } from "vitest";
import { validateSessionsCreateParams } from "../index.js";

describe("sessions.create schema", () => {
  it.each(["read-only", "guarded", "workspace", "full"])(
    "accepts the closed permission mode %s",
    (permissionMode) => {
      expect(validateSessionsCreateParams({ agentId: "main", permissionMode })).toBe(true);
    },
  );

  it("rejects unknown permission modes", () => {
    expect(validateSessionsCreateParams({ agentId: "main", permissionMode: "unrestricted" })).toBe(
      false,
    );
  });

  it("accepts additive create-time visibility values", () => {
    for (const visibility of ["shared", "read-only", "suggest", "draft"]) {
      expect(validateSessionsCreateParams({ agentId: "main", visibility })).toBe(true);
    }
  });

  it("rejects unknown visibility values", () => {
    expect(validateSessionsCreateParams({ agentId: "main", visibility: "private" })).toBe(false);
  });

  it("accepts initial session tool overrides", () => {
    expect(
      validateSessionsCreateParams({
        agentId: "main",
        toolOverrides: {
          mcpServers: { github: false },
          skills: { release: true },
          webSearch: false,
        },
      }),
    ).toBe(true);
  });

  it.each([null, { webSearch: "yes" }, { skills: { release: "yes" } }, { unknown: true }])(
    "rejects malformed initial tool overrides %#",
    (toolOverrides) => {
      expect(validateSessionsCreateParams({ agentId: "main", toolOverrides })).toBe(false);
    },
  );
});
