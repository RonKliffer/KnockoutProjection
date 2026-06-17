import type { KnockoutMatch } from "./types";

export interface BracketRound {
  label: string;
  matches: KnockoutMatch[];
}

export interface BracketLayout {
  leftRounds: BracketRound[];
  rightRounds: BracketRound[];
  finals: KnockoutMatch[];
}

const LEFT_SEMIFINAL = 101;
const RIGHT_SEMIFINAL = 102;
const FINALS = [104, 103];
const ROUND_LABELS = ["Semifinal", "Quarterfinals", "Round of 16", "Round of 32"];

export function buildBracketLayout(roundOf32: KnockoutMatch[], laterRounds: KnockoutMatch[]): BracketLayout {
  const byNumber = new Map([...roundOf32, ...laterRounds].map((match) => [match.matchNumber, match]));
  const leftRounds = buildHalfRounds(byNumber, LEFT_SEMIFINAL).reverse();
  const rightRounds = buildHalfRounds(byNumber, RIGHT_SEMIFINAL);
  const finals = matchesByNumber(byNumber, FINALS);

  return { leftRounds, rightRounds, finals };
}

function buildHalfRounds(matches: Map<number, KnockoutMatch>, semifinalNumber: number): BracketRound[] {
  return collectRounds(matches, semifinalNumber).map((roundMatches, index) => ({
    label: ROUND_LABELS[index] ?? roundMatches[0]?.round ?? "",
    matches: roundMatches
  }));
}

function collectRounds(matches: Map<number, KnockoutMatch>, matchNumber: number, depth = 0, rounds: KnockoutMatch[][] = []): KnockoutMatch[][] {
  const match = matches.get(matchNumber);
  if (!match) {
    return rounds;
  }

  rounds[depth] = [...(rounds[depth] ?? []), match];

  for (const feederNumber of feederMatchNumbers(match)) {
    collectRounds(matches, feederNumber, depth + 1, rounds);
  }

  return rounds;
}

function feederMatchNumbers(match: KnockoutMatch): number[] {
  return [match.homeSlot, match.awaySlot].map(feederMatchNumber).filter(Boolean) as number[];
}

function feederMatchNumber(slot: string): number | undefined {
  return Number(slot.match(/^Winner Match (\d+)$/)?.[1]);
}

function matchesByNumber(matches: Map<number, KnockoutMatch>, numbers: number[]): KnockoutMatch[] {
  return numbers.map((number) => matches.get(number)).filter(Boolean) as KnockoutMatch[];
}
