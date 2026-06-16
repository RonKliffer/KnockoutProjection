import type { GroupLetter, GroupMatch, TeamStanding, ThirdPlaceRanking, UserResult } from "./types";
import { GROUPS } from "./parse";

export function buildSimulatedGroups(
  currentGroups: Record<GroupLetter, TeamStanding[]>,
  groupMatches: Record<GroupLetter, GroupMatch[]>,
  userResults: Record<string, UserResult>
): Record<GroupLetter, TeamStanding[]> {
  const output = {} as Record<GroupLetter, TeamStanding[]>;

  for (const group of GROUPS) {
    const originalOrder = new Map(currentGroups[group].map((team, index) => [team.team, index]));
    const standings = new Map(
      currentGroups[group].map((team, index) => [
        team.team,
        emptyStanding(group, team.team, index + 1, team.note)
      ])
    );

    for (const match of groupMatches[group]) {
      const result = match.played
        ? { homeScore: match.homeScore, awayScore: match.awayScore }
        : userResults[match.id];

      if (result?.homeScore === undefined || result.awayScore === undefined) {
        continue;
      }

      applyResult(standings, match, result.homeScore, result.awayScore);
    }

    output[group] = rankGroupStandings(Array.from(standings.values()), groupMatches[group], userResults, originalOrder)
      .map((standing, index) => ({ ...standing, position: index + 1 }));
  }

  return output;
}

function rankGroupStandings(
  standings: TeamStanding[],
  matches: GroupMatch[],
  userResults: Record<string, UserResult>,
  originalOrder: Map<string, number>
): TeamStanding[] {
  const pointGroups = new Map<number, TeamStanding[]>();

  for (const team of standings) {
    pointGroups.set(team.points, [...(pointGroups.get(team.points) ?? []), team]);
  }

  return Array.from(pointGroups.entries())
    .sort(([a], [b]) => b - a)
    .flatMap(([, tiedTeams]) => rankTiedTeams(tiedTeams, matches, userResults, originalOrder));
}

function rankTiedTeams(
  tiedTeams: TeamStanding[],
  matches: GroupMatch[],
  userResults: Record<string, UserResult>,
  originalOrder: Map<string, number>
): TeamStanding[] {
  if (tiedTeams.length < 2) {
    return tiedTeams;
  }

  const tiedNames = new Set(tiedTeams.map((team) => team.team));
  const headToHead = new Map(tiedTeams.map((team) => [team.team, emptyStanding(team.group, team.team, team.position, team.note)]));

  for (const match of matches) {
    if (!tiedNames.has(match.homeTeam) || !tiedNames.has(match.awayTeam)) {
      continue;
    }

    const result = match.played
      ? { homeScore: match.homeScore, awayScore: match.awayScore }
      : userResults[match.id];

    if (result?.homeScore === undefined || result.awayScore === undefined) {
      continue;
    }

    applyResult(headToHead, match, result.homeScore, result.awayScore);
  }

  const rankedByHeadToHead = [...tiedTeams].sort((a, b) =>
    compareHeadToHead(a, b, headToHead)
  );

  return splitEqualHeadToHeadGroups(rankedByHeadToHead, headToHead).flatMap((sameHeadToHead) => {
    if (sameHeadToHead.length === tiedTeams.length) {
      return sameHeadToHead.sort((a, b) => compareOverallAfterHeadToHead(a, b, originalOrder));
    }

    return rankTiedTeams(sameHeadToHead, matches, userResults, originalOrder);
  });
}

function splitEqualHeadToHeadGroups(
  teams: TeamStanding[],
  headToHead: Map<string, TeamStanding>
): TeamStanding[][] {
  const groups: TeamStanding[][] = [];

  for (const team of teams) {
    const previousGroup = groups[groups.length - 1];
    const previousTeam = previousGroup?.[previousGroup.length - 1];

    if (!previousTeam || compareHeadToHead(team, previousTeam, headToHead) !== 0) {
      groups.push([team]);
    } else {
      previousGroup.push(team);
    }
  }

  return groups;
}

export function buildSimulatedThirdPlaceRanking(
  groups: Record<GroupLetter, TeamStanding[]>,
  currentThirdPlaceRanking: ThirdPlaceRanking[]
): ThirdPlaceRanking[] {
  const originalRank = new Map(currentThirdPlaceRanking.map((entry) => [entry.group, entry.rank]));

  return GROUPS.map((group) => groups[group][2])
    .sort((a, b) => compareThirds(a, b, originalRank))
    .map((team, index) => ({
      rank: index + 1,
      group: team.group,
      team: team.team,
      played: team.played,
      wins: team.wins,
      draws: team.draws,
      losses: team.losses,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
      points: team.points,
      qualified: index < 8
    }));
}

function emptyStanding(group: GroupLetter, team: string, position: number, note?: string): TeamStanding {
  return {
    group,
    position,
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    note
  };
}

function applyResult(standings: Map<string, TeamStanding>, match: GroupMatch, homeScore: number, awayScore: number): void {
  const home = standings.get(match.homeTeam);
  const away = standings.get(match.awayTeam);

  if (!home || !away) {
    return;
  }

  home.played += 1;
  away.played += 1;
  home.goalsFor += homeScore;
  home.goalsAgainst += awayScore;
  away.goalsFor += awayScore;
  away.goalsAgainst += homeScore;
  home.goalDifference = home.goalsFor - home.goalsAgainst;
  away.goalDifference = away.goalsFor - away.goalsAgainst;

  if (homeScore > awayScore) {
    home.wins += 1;
    away.losses += 1;
    home.points += 3;
  } else if (awayScore > homeScore) {
    away.wins += 1;
    home.losses += 1;
    away.points += 3;
  } else {
    home.draws += 1;
    away.draws += 1;
    home.points += 1;
    away.points += 1;
  }
}

function compareHeadToHead(
  a: TeamStanding,
  b: TeamStanding,
  headToHead: Map<string, TeamStanding>
): number {
  const headA = headToHead.get(a.team);
  const headB = headToHead.get(b.team);

  return (
    (headB?.points ?? 0) - (headA?.points ?? 0) ||
    (headB?.goalDifference ?? 0) - (headA?.goalDifference ?? 0) ||
    (headB?.goalsFor ?? 0) - (headA?.goalsFor ?? 0)
  );
}

function compareOverallAfterHeadToHead(a: TeamStanding, b: TeamStanding, originalOrder: Map<string, number>): number {
  return (
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    (originalOrder.get(a.team) ?? 99) - (originalOrder.get(b.team) ?? 99)
  );
}

function compareThirds(
  a: TeamStanding,
  b: TeamStanding,
  originalRank: Map<GroupLetter, number>
): number {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    (originalRank.get(a.group) ?? 99) - (originalRank.get(b.group) ?? 99)
  );
}
