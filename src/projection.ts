import { buildLaterRounds } from "./parse";
import type {
  BracketProjection,
  GroupLetter,
  KnockoutMatch,
  TeamStanding,
  ThirdPlaceCombination,
  ThirdPlaceRanking
} from "./types";

export function buildProjection(
  groups: Record<GroupLetter, TeamStanding[]>,
  thirdPlaceRanking: ThirdPlaceRanking[],
  combinations: ThirdPlaceCombination[],
  roundOf32: KnockoutMatch[],
  laterRounds: KnockoutMatch[] = buildLaterRounds()
): BracketProjection {
  const qualifiedGroups = thirdPlaceRanking
    .filter((entry) => entry.qualified)
    .map((entry) => entry.group)
    .sort()
    .join("");
  const combination = combinations.find((entry) => entry.key === qualifiedGroups);

  if (!combination) {
    throw new Error(`No third-place combination found for groups ${qualifiedGroups}`);
  }

  const projectedMatches = new Map<number, KnockoutMatch>();
  const projectedRoundOf32 = roundOf32.map((match) => projectMatch(match, groups, thirdPlaceRanking, combination, projectedMatches));
  const projectedLaterRounds = laterRounds.map((match) => projectMatch(match, groups, thirdPlaceRanking, combination, projectedMatches));

  return {
    roundOf32: projectedRoundOf32,
    laterRounds: projectedLaterRounds,
    thirdPlaceKey: qualifiedGroups
  };
}

export function resolveSlot(
  slot: string,
  groups: Record<GroupLetter, TeamStanding[]>,
  thirdPlaceRanking: ThirdPlaceRanking[],
  combination: ThirdPlaceCombination
): string {
  const winner = slot.match(/^Winner Group ([A-L])$/);
  if (winner) {
    return teamAt(groups, winner[1] as GroupLetter, 0) ?? slot;
  }

  const runnerUp = slot.match(/^Runner-up Group ([A-L])$/);
  if (runnerUp) {
    return teamAt(groups, runnerUp[1] as GroupLetter, 1) ?? slot;
  }

  const thirdGroup = slot.match(/^3rd Group ([A-L/]+)$/);
  if (thirdGroup) {
    const slotKey = slotToCombinationColumn(slot);
    const assignedGroup = combination.slotAssignments[slotKey]?.replace("3", "") as GroupLetter | undefined;
    if (!assignedGroup) {
      return slot;
    }

    return thirdPlaceRanking.find((entry) => entry.group === assignedGroup)?.team ?? teamAt(groups, assignedGroup, 2) ?? slot;
  }

  return slot;
}

function projectMatch(
  match: KnockoutMatch,
  groups: Record<GroupLetter, TeamStanding[]>,
  thirdPlaceRanking: ThirdPlaceRanking[],
  combination: ThirdPlaceCombination,
  projectedMatches: Map<number, KnockoutMatch>
): KnockoutMatch {
  const resolvedHomeTeam = resolveKnockoutSlot(match.homeSlot, groups, thirdPlaceRanking, combination, projectedMatches);
  const resolvedAwayTeam = resolveKnockoutSlot(match.awaySlot, groups, thirdPlaceRanking, combination, projectedMatches);
  const homeTeam = preferParsedTeam(match.resolvedHomeTeam, match.homeSlot, resolvedHomeTeam);
  const awayTeam = preferParsedTeam(match.resolvedAwayTeam, match.awaySlot, resolvedAwayTeam);
  const result = resolveResult(match, homeTeam, awayTeam);
  const projected = {
    ...match,
    resolvedHomeTeam: homeTeam,
    resolvedAwayTeam: awayTeam,
    ...result
  };

  projectedMatches.set(projected.matchNumber, projected);
  return projected;
}

function resolveKnockoutSlot(
  slot: string,
  groups: Record<GroupLetter, TeamStanding[]>,
  thirdPlaceRanking: ThirdPlaceRanking[],
  combination: ThirdPlaceCombination,
  projectedMatches: Map<number, KnockoutMatch>
): string {
  const winnerMatch = slot.match(/^Winner Match (\d+)$/);
  if (winnerMatch) {
    return projectedMatches.get(Number(winnerMatch[1]))?.winnerTeam ?? slot;
  }

  const loserMatch = slot.match(/^Loser Match (\d+)$/);
  if (loserMatch) {
    return projectedMatches.get(Number(loserMatch[1]))?.loserTeam ?? slot;
  }

  return resolveSlot(slot, groups, thirdPlaceRanking, combination);
}

function preferParsedTeam(parsedTeam: string, slot: string, resolvedTeam: string): string {
  return parsedTeam && parsedTeam !== slot ? parsedTeam : resolvedTeam;
}

function resolveResult(
  match: KnockoutMatch,
  resolvedHomeTeam: string,
  resolvedAwayTeam: string
): Pick<KnockoutMatch, "played" | "winnerTeam" | "loserTeam"> {
  if (!match.played) {
    return {
      played: match.played,
      winnerTeam: match.winnerTeam,
      loserTeam: match.loserTeam
    };
  }

  if (match.winnerTeam) {
    return {
      played: match.played,
      winnerTeam: match.winnerTeam,
      loserTeam: match.loserTeam
    };
  }

  if (match.homeScore === undefined || match.awayScore === undefined || match.homeScore === match.awayScore) {
    return {
      played: match.played,
      winnerTeam: undefined,
      loserTeam: undefined
    };
  }

  const homeWon = match.homeScore > match.awayScore;
  return {
    played: match.played,
    winnerTeam: homeWon ? resolvedHomeTeam : resolvedAwayTeam,
    loserTeam: homeWon ? resolvedAwayTeam : resolvedHomeTeam
  };
}

function slotToCombinationColumn(slot: string): string {
  const groups = slot.match(/^3rd Group ([A-L/]+)$/)?.[1].replaceAll("/", "") ?? "";
  switch (groups) {
    case "CEFHI":
      return "1A";
    case "EFGIJ":
      return "1B";
    case "BEFIJ":
      return "1D";
    case "ABCDF":
      return "1E";
    case "AEHIJ":
      return "1G";
    case "CDFGH":
      return "1I";
    case "DEIJL":
      return "1K";
    case "EHIJK":
      return "1L";
    default:
      throw new Error(`Unexpected third-place slot: ${slot}`);
  }
}

function teamAt(groups: Record<GroupLetter, TeamStanding[]>, group: GroupLetter, index: number): string | undefined {
  return groups[group]?.[index]?.team;
}
