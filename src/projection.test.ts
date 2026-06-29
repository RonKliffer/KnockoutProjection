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

  it("fills future winner slots from completed knockout matches", () => {
    const projection = buildProjection(
      groups,
      thirdPlaceRanking,
      combinations,
      [
        {
          ...roundOf32[0],
          homeScore: 2,
          awayScore: 1,
          played: true
        },
        roundOf32[1]
      ]
    );
    const match90 = projection.laterRounds.find((match) => match.matchNumber === 90);

    expect(projection.roundOf32[0]).toMatchObject({
      winnerTeam: "A2",
      loserTeam: "B2"
    });
    expect(match90).toMatchObject({
      resolvedHomeTeam: "A2",
      resolvedAwayTeam: "Winner Match 75"
    });
  });

  it("fills the third-place match from semifinal losers", () => {
    const projection = buildProjection(groups, thirdPlaceRanking, combinations, [], [
      knockoutMatch({
        matchNumber: 101,
        round: "Semifinals",
        homeSlot: "Winner Match 97",
        awaySlot: "Winner Match 98",
        resolvedHomeTeam: "Argentina",
        resolvedAwayTeam: "Brazil",
        homeScore: 0,
        awayScore: 1,
        played: true
      }),
      knockoutMatch({
        matchNumber: 102,
        round: "Semifinals",
        homeSlot: "Winner Match 99",
        awaySlot: "Winner Match 100",
        resolvedHomeTeam: "France",
        resolvedAwayTeam: "Spain",
        homeScore: 3,
        awayScore: 2,
        played: true
      }),
      knockoutMatch({
        matchNumber: 103,
        round: "Third place",
        homeSlot: "Loser Match 101",
        awaySlot: "Loser Match 102",
        resolvedHomeTeam: "Loser Match 101",
        resolvedAwayTeam: "Loser Match 102"
      })
    ]);
    const thirdPlace = projection.laterRounds.find((match) => match.matchNumber === 103);

    expect(thirdPlace).toMatchObject({
      resolvedHomeTeam: "Argentina",
      resolvedAwayTeam: "Spain"
    });
  });

  it("keeps unresolved future slots as placeholders", () => {
    const projection = buildProjection(groups, thirdPlaceRanking, combinations, []);
    const match89 = projection.laterRounds.find((match) => match.matchNumber === 89);

    expect(match89).toMatchObject({
      resolvedHomeTeam: "Winner Match 74",
      resolvedAwayTeam: "Winner Match 77"
    });
  });
});

function knockoutMatch(overrides: Partial<KnockoutMatch>): KnockoutMatch {
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
