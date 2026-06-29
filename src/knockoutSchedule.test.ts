import { describe, expect, it } from "vitest";
import { buildKnockoutSchedule } from "./knockoutSchedule";
import type { KnockoutMatch } from "./types";

describe("knockout schedule", () => {
  it("groups stages in bracket order and sorts matches by kickoff", () => {
    const stages = buildKnockoutSchedule(
      [
        match({ matchNumber: 74, round: "Round of 32", kickoffAt: "2026-06-29T17:00:00.000Z" }),
        match({ matchNumber: 73, round: "Round of 32", kickoffAt: "2026-06-28T19:00:00.000Z" })
      ],
      [
        match({ matchNumber: 104, round: "Final", kickoffAt: "2026-07-19T16:00:00.000Z" }),
        match({ matchNumber: 89, round: "Round of 16", kickoffAt: "2026-07-04T19:00:00.000Z" }),
        match({ matchNumber: 101, round: "Semifinals", kickoffAt: "2026-07-14T19:00:00.000Z" }),
        match({ matchNumber: 99, round: "Quarterfinals", kickoffAt: "2026-07-10T19:00:00.000Z" })
      ]
    );

    expect(stages.map((stage) => stage.round)).toEqual(["Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"]);
    expect(stages[0].matches.map((stageMatch) => stageMatch.matchNumber)).toEqual([73, 74]);
  });

  it("places missing kickoff times after dated matches and then falls back to match number", () => {
    const stages = buildKnockoutSchedule(
      [
        match({ matchNumber: 76, round: "Round of 32" }),
        match({ matchNumber: 74, round: "Round of 32" }),
        match({ matchNumber: 75, round: "Round of 32", kickoffAt: "2026-06-30T20:00:00.000Z" })
      ],
      []
    );

    expect(stages[0].matches.map((stageMatch) => stageMatch.matchNumber)).toEqual([75, 74, 76]);
  });

  it("sorts completed and upcoming matches together by kickoff while preserving completed scores", () => {
    const stages = buildKnockoutSchedule(
      [
        match({ matchNumber: 74, round: "Round of 32", kickoffAt: "2026-06-29T17:00:00.000Z", played: false }),
        match({
          matchNumber: 73,
          round: "Round of 32",
          kickoffAt: "2026-06-28T19:00:00.000Z",
          homeScore: 2,
          awayScore: 1,
          played: true,
          winnerTeam: "Home",
          loserTeam: "Away"
        })
      ],
      []
    );

    expect(stages[0].matches.map((stageMatch) => stageMatch.matchNumber)).toEqual([73, 74]);
    expect(stages[0].matches[0]).toMatchObject({
      matchNumber: 73,
      homeScore: 2,
      awayScore: 1,
      played: true,
      winnerTeam: "Home"
    });
  });
});

function match(overrides: Partial<KnockoutMatch>): KnockoutMatch {
  return {
    matchNumber: 1,
    round: "Round of 32",
    date: "",
    time: "",
    venue: "",
    homeSlot: "Home",
    awaySlot: "Away",
    resolvedHomeTeam: "Home",
    resolvedAwayTeam: "Away",
    ...overrides
  };
}
