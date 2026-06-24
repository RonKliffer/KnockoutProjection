import { describe, expect, it } from "vitest";
import { teamFlag } from "./flags";

const ENGLAND_FLAG = "\u{1f3f4}\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}";
const SCOTLAND_FLAG = "\u{1f3f4}\u{e0067}\u{e0062}\u{e0073}\u{e0063}\u{e0074}\u{e007f}";
const WALES_FLAG = "\u{1f3f4}\u{e0067}\u{e0062}\u{e0077}\u{e006c}\u{e0073}\u{e007f}";

describe("team flags", () => {
  it("returns emoji flags for known team names", () => {
    expect(teamFlag("France")).toBe("🇫🇷");
    expect(teamFlag("South Korea")).toBe("🇰🇷");
    expect(teamFlag("DR Congo")).toBe("🇨🇩");
    expect(teamFlag("Iran")).toBe("🇮🇷");
    expect(teamFlag("Cape Verde")).toBe("🇨🇻");
  });

  it("returns subdivision flag emojis for UK football teams", () => {
    expect(teamFlag("England")).toBe(ENGLAND_FLAG);
    expect(teamFlag("Scotland")).toBe(SCOTLAND_FLAG);
    expect(teamFlag("Wales")).toBe(WALES_FLAG);
    expect(teamFlag("Northern Ireland")).not.toBe("🏴");
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
