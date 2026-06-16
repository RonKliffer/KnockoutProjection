export type GroupLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export interface TeamStanding {
  group: GroupLetter;
  position: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  note?: string;
}

export interface ThirdPlaceRanking {
  rank: number;
  group: GroupLetter;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  qualified: boolean;
}

export interface GroupMatch {
  id: string;
  group: GroupLetter;
  matchNumber?: number;
  date: string;
  time: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  played: boolean;
}

export interface UserResult {
  homeScore?: number;
  awayScore?: number;
}

export interface KnockoutMatch {
  matchNumber: number;
  round: string;
  date: string;
  time: string;
  venue: string;
  homeSlot: string;
  awaySlot: string;
  resolvedHomeTeam: string;
  resolvedAwayTeam: string;
}

export interface ThirdPlaceCombination {
  key: string;
  slotAssignments: Record<string, string>;
}

export interface BracketProjection {
  roundOf32: KnockoutMatch[];
  laterRounds: KnockoutMatch[];
  thirdPlaceKey: string;
}

export interface TournamentData {
  groups: Record<GroupLetter, TeamStanding[]>;
  groupMatches: Record<GroupLetter, GroupMatch[]>;
  knockoutCombinations: ThirdPlaceCombination[];
  roundOf32: KnockoutMatch[];
  thirdPlaceRanking: ThirdPlaceRanking[];
  projection: BracketProjection;
  fetchedAt: Date;
  sourceUpdatedText?: string;
}
