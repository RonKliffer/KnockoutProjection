import { describe, expect, it } from "vitest";
import { teamFlag } from "./flags";

describe("team flags", () => {
  it("returns emoji flags for known team names", () => {
    expect(teamFlag("France")).toBe("🇫🇷");
    expect(teamFlag("South Korea")).toBe("🇰🇷");
    expect(teamFlag("DR Congo")).toBe("🇨🇩");
  });

  it("does not render flags for unresolved bracket placeholders", () => {
    expect(teamFlag("Winner Match 73")).toBe("");
    expect(teamFlag("Runner-up Group A")).toBe("");
    expect(teamFlag("3rd Group C/D/F/G/H")).toBe("");
  });

  it("normalizes common suffixes and accented names", () => {
    expect(teamFlag("Mexico (H, Q)")).toBe("🇲🇽");
    expect(teamFlag("Türkiye")).toBe("🇹🇷");
    expect(teamFlag("Côte d'Ivoire")).toBe("🇨🇮");
  });
});
