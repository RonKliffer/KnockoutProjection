import type { KnockoutMatch } from "./types";

export interface KnockoutScheduleStage {
  round: string;
  matches: KnockoutMatch[];
}

const ROUND_ORDER = ["Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Third place", "Final"];

export function buildKnockoutSchedule(roundOf32: KnockoutMatch[], laterRounds: KnockoutMatch[]): KnockoutScheduleStage[] {
  const matchesByRound = new Map<string, KnockoutMatch[]>();

  for (const match of [...roundOf32, ...laterRounds]) {
    matchesByRound.set(match.round, [...(matchesByRound.get(match.round) ?? []), match]);
  }

  return ROUND_ORDER.map((round) => {
    const matches = matchesByRound.get(round);
    return matches ? { round, matches: sortMatches(matches) } : undefined;
  }).filter((stage): stage is KnockoutScheduleStage => Boolean(stage));
}

function sortMatches(matches: KnockoutMatch[]): KnockoutMatch[] {
  return [...matches].sort((first, second) => {
    const firstKickoff = kickoffTime(first);
    const secondKickoff = kickoffTime(second);

    if (firstKickoff !== secondKickoff) {
      return firstKickoff - secondKickoff;
    }

    return first.matchNumber - second.matchNumber;
  });
}

function kickoffTime(match: KnockoutMatch): number {
  if (!match.kickoffAt) {
    return Number.POSITIVE_INFINITY;
  }

  const time = new Date(match.kickoffAt).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}
