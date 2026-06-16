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
  roundOf32: KnockoutMatch[]
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

  return {
    roundOf32: roundOf32.map((match) => ({
      ...match,
      resolvedHomeTeam: resolveSlot(match.homeSlot, groups, thirdPlaceRanking, combination),
      resolvedAwayTeam: resolveSlot(match.awaySlot, groups, thirdPlaceRanking, combination)
    })),
    laterRounds: buildLaterRounds(),
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
