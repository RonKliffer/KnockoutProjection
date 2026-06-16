import { describe, expect, it } from "vitest";
import { buildProjection } from "./projection";
import type { GroupLetter, KnockoutMatch, TeamStanding, ThirdPlaceCombination, ThirdPlaceRanking } from "./types";

const letters = "ABCDEFGHIJKL".split("") as GroupLetter[];
const groups = Object.fromEntries(
  letters.map((group) => [
    group,
    [0, 1, 2, 3].map((index) => ({
      group,
      position: index + 1,
      team: `${group}${index + 1}`,
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

const thirdPlaceRanking: ThirdPlaceRanking[] = letters.map((group, index) => ({
  rank: index + 1,
  group,
  team: `${group}3`,
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0,
  qualified: index < 8
}));

const combinations: ThirdPlaceCombination[] = [
  {
    key: "ABCDEFGH",
    slotAssignments: {
      "1A": "3C",
      "1B": "3B",
      "1D": "3D",
      "1E": "3E",
      "1G": "3A",
      "1I": "3F",
      "1K": "3G",
      "1L": "3H"
    }
  }
];

const roundOf32: KnockoutMatch[] = [
  {
    matchNumber: 73,
    round: "Round of 32",
    date: "",
    time: "",
    venue: "",
    homeSlot: "Runner-up Group A",
    awaySlot: "Runner-up Group B",
    resolvedHomeTeam: "",
    resolvedAwayTeam: ""
  },
  {
    matchNumber: 79,
    round: "Round of 32",
    date: "",
    time: "",
    venue: "",
    homeSlot: "Winner Group A",
    awaySlot: "3rd Group C/E/F/H/I",
    resolvedHomeTeam: "",
    resolvedAwayTeam: ""
  }
];

describe("projection", () => {
  it("resolves fixed and third-place slots", () => {
    const projection = buildProjection(groups, thirdPlaceRanking, combinations, roundOf32);
    expect(projection.roundOf32[0].resolvedHomeTeam).toBe("A2");
    expect(projection.roundOf32[0].resolvedAwayTeam).toBe("B2");
    expect(projection.roundOf32[1].resolvedHomeTeam).toBe("A1");
    expect(projection.roundOf32[1].resolvedAwayTeam).toBe("C3");
    expect(projection.laterRounds).toHaveLength(16);
  });
});
