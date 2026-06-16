import { describe, expect, it } from "vitest";
import { buildSimulatedGroups } from "./simulation";
import type { GroupLetter, GroupMatch, TeamStanding } from "./types";

const groupLetters = "ABCDEFGHIJKL".split("") as GroupLetter[];

function blankGroups(): Record<GroupLetter, TeamStanding[]> {
  return Object.fromEntries(
    groupLetters.map((group) => [
      group,
      ["Alpha", "Bravo", "Charlie", "Delta"].map((team, index) => ({
        group,
        position: index + 1,
        team: `${group}${team}`,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }))
    ])
  ) as Record<GroupLetter, TeamStanding[]>;
}

function blankMatches(): Record<GroupLetter, GroupMatch[]> {
  const matches = {} as Record<GroupLetter, GroupMatch[]>;
  for (const group of groupLetters) {
    matches[group] = [];
  }
  return matches;
}

describe("simulated standings tie-breakers", () => {
  it("uses head-to-head before overall goal difference for teams tied on points", () => {
    const groups = blankGroups();
    const matches = blankMatches();
    matches.A = [
      played("AAlpha", "ABravo", 1, 0),
      played("AAlpha", "ACharlie", 0, 5),
      played("AAlpha", "ADelta", 1, 0),
      played("ABravo", "ACharlie", 3, 0),
      played("ABravo", "ADelta", 3, 0),
      played("ACharlie", "ADelta", 0, 1)
    ];

    const simulated = buildSimulatedGroups(groups, matches, {});

    expect(simulated.A.slice(0, 2).map((team) => team.team)).toEqual(["AAlpha", "ABravo"]);
    expect(simulated.A.slice(0, 2).map((team) => team.goalDifference)).toEqual([-3, 5]);
  });
});

function played(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number): GroupMatch {
  return {
    id: `${homeTeam}-${awayTeam}`,
    group: "A",
    date: "",
    time: "",
    venue: "",
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    played: true
  };
}
