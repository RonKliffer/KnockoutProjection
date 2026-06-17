import { describe, expect, it } from "vitest";
import { formatMatchSchedule } from "./timeFormat";

describe("time formatting", () => {
  it("formats kickoff instants in the requested timezone", () => {
    const match = {
      date: "June 18, 2026",
      time: "12:00 p.m. UTC−4",
      kickoffAt: "2026-06-18T16:00:00.000Z"
    };

    expect(formatMatchSchedule(match, "UTC")).toBe("Jun 18, 2026 · 4:00 PM");
    expect(formatMatchSchedule(match, "Asia/Jerusalem")).toBe("Jun 18, 2026 · 7:00 PM");
  });

  it("falls back to raw date and time when kickoff is missing", () => {
    expect(
      formatMatchSchedule({
        date: "June 18, 2026",
        time: "12:00 p.m. UTC−4",
        venue: "MetLife Stadium"
      })
    ).toBe("June 18, 2026 · 12:00 p.m. UTC−4 · MetLife Stadium");
  });

  it("can omit venue from a schedule line", () => {
    expect(
      formatMatchSchedule(
        {
          date: "June 18, 2026",
          time: "12:00 p.m. UTC−4",
          kickoffAt: "2026-06-18T16:00:00.000Z",
          venue: undefined
        },
        "Asia/Jerusalem"
      )
    ).toBe("Jun 18, 2026 · 7:00 PM");
  });
});
