import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { parseGroupStandings } from "./parse";
import { renderScheduleMatch, resolveThirdPlaceRanking } from "./app";
import type { KnockoutMatch } from "./types";

function doc(html: string): Document {
  return new JSDOM(html).window.document;
}

const groupsOnlyHtml = `
  ${["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
    .map(
      (group, index) => `
      <h3>Group ${group}</h3>
      <table class="wikitable">
        <tbody>
          <tr><th>Pos</th><th>Team</th><th>Pld</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          <tr><td>1</td><td>${group} Winner</td><td>3</td><td>2</td><td>1</td><td>0</td><td>5</td><td>1</td><td>+4</td><td>7</td></tr>
          <tr><td>2</td><td>${group} Runner</td><td>3</td><td>1</td><td>2</td><td>0</td><td>4</td><td>2</td><td>+2</td><td>5</td></tr>
          <tr><td>3</td><td>${group} Third</td><td>3</td><td>1</td><td>0</td><td>2</td><td>${12 - index}</td><td>4</td><td>${8 - index}</td><td>3</td></tr>
          <tr><td>4</td><td>${group} Fourth</td><td>3</td><td>0</td><td>1</td><td>2</td><td>1</td><td>6</td><td>-5</td><td>1</td></tr>
        </tbody>
      </table>
    `
    )
    .join("")}
`;

describe("app data loading helpers", () => {
  it("falls back to standings-derived third-place ranking when the source table is missing", () => {
    const document = doc(groupsOnlyHtml);
    const groups = parseGroupStandings(document);
    const ranking = resolveThirdPlaceRanking(document, groups);

    expect(ranking).toHaveLength(12);
    expect(ranking[0]).toMatchObject({ group: "A", team: "A Third", qualified: true });
    expect(ranking[7]).toMatchObject({ group: "H", qualified: true });
    expect(ranking[8]).toMatchObject({ group: "I", qualified: false });
  });
});

describe("schedule match rendering", () => {
  it("centers completed scores around the full-time label", () => {
    const document = doc(renderScheduleMatch(match({
      homeScore: 0,
      awayScore: 1,
      played: true,
      winnerTeam: "Canada"
    }), {}));

    expect(document.querySelector(".schedule-team-home")?.textContent).toContain("South Africa");
    expect(document.querySelector(".schedule-scoreline")?.textContent?.replace(/\s+/g, " ").trim()).toBe("0 FT 1");
    expect(document.querySelector(".schedule-team-away")?.textContent).toContain("Canada");
    expect(document.querySelectorAll(".schedule-scoreline .match-score")).toHaveLength(2);
  });

  it("keeps upcoming matches as team versus team without score pills", () => {
    const document = doc(renderScheduleMatch(match({ played: false }), {}));

    expect(document.querySelector(".schedule-versus")?.textContent?.trim()).toBe("vs");
    expect(document.querySelectorAll(".schedule-scoreline .match-score")).toHaveLength(0);
  });
});

function match(overrides: Partial<KnockoutMatch>): KnockoutMatch {
  return {
    matchNumber: 73,
    round: "Round of 32",
    date: "June 28, 2026",
    time: "12:00 p.m. UTC−7",
    kickoffAt: "2026-06-28T19:00:00.000Z",
    venue: "SoFi Stadium, Inglewood",
    homeSlot: "Runner-up Group A",
    awaySlot: "Runner-up Group B",
    resolvedHomeTeam: "South Africa",
    resolvedAwayTeam: "Canada",
    ...overrides
  };
}
