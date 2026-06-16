import type {
  GroupLetter,
  GroupMatch,
  KnockoutMatch,
  TeamStanding,
  ThirdPlaceCombination,
  ThirdPlaceRanking
} from "./types";

export const GROUPS: GroupLetter[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const THIRD_PLACE_SLOTS = ["1A", "1B", "1D", "1E", "1G", "1I", "1K", "1L"];
const ROUND_OF_32_SCHEDULE: Array<[number, string, string]> = [
  [73, "Runner-up Group A", "Runner-up Group B"],
  [74, "Winner Group E", "3rd Group A/B/C/D/F"],
  [75, "Winner Group F", "Runner-up Group C"],
  [76, "Winner Group C", "Runner-up Group F"],
  [77, "Winner Group I", "3rd Group C/D/F/G/H"],
  [78, "Runner-up Group E", "Runner-up Group I"],
  [79, "Winner Group A", "3rd Group C/E/F/H/I"],
  [80, "Winner Group L", "3rd Group E/H/I/J/K"],
  [81, "Winner Group D", "3rd Group B/E/F/I/J"],
  [82, "Winner Group G", "3rd Group A/E/H/I/J"],
  [83, "Runner-up Group K", "Runner-up Group L"],
  [84, "Winner Group H", "Runner-up Group J"],
  [85, "Winner Group B", "3rd Group E/F/G/I/J"],
  [86, "Winner Group J", "Runner-up Group H"],
  [87, "Winner Group K", "3rd Group D/E/I/J/L"],
  [88, "Runner-up Group D", "Runner-up Group G"]
];

const LATER_ROUNDS: Array<[number, string, string, string]> = [
  [89, "Round of 16", "Winner Match 73", "Winner Match 75"],
  [90, "Round of 16", "Winner Match 74", "Winner Match 77"],
  [91, "Round of 16", "Winner Match 76", "Winner Match 78"],
  [92, "Round of 16", "Winner Match 79", "Winner Match 80"],
  [93, "Round of 16", "Winner Match 83", "Winner Match 84"],
  [94, "Round of 16", "Winner Match 81", "Winner Match 82"],
  [95, "Round of 16", "Winner Match 86", "Winner Match 88"],
  [96, "Round of 16", "Winner Match 85", "Winner Match 87"],
  [97, "Quarterfinals", "Winner Match 89", "Winner Match 90"],
  [98, "Quarterfinals", "Winner Match 93", "Winner Match 94"],
  [99, "Quarterfinals", "Winner Match 91", "Winner Match 92"],
  [100, "Quarterfinals", "Winner Match 95", "Winner Match 96"],
  [101, "Semifinals", "Winner Match 97", "Winner Match 98"],
  [102, "Semifinals", "Winner Match 99", "Winner Match 100"],
  [103, "Third place", "Loser Match 101", "Loser Match 102"],
  [104, "Final", "Winner Match 101", "Winner Match 102"]
];

export function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}

export function parseGroupStandings(document: Document): Record<GroupLetter, TeamStanding[]> {
  const groups = {} as Record<GroupLetter, TeamStanding[]>;

  for (const group of GROUPS) {
    const heading = findHeading(document, `Group ${group}`);
    const table = heading ? nextWikitable(heading) : null;
    if (!table) {
      throw new Error(`Could not find standings table for Group ${group}`);
    }

    const rows = Array.from(table.querySelectorAll("tbody tr")).filter((row) => row.querySelector("td"));
    groups[group] = rows.map((row) => parseStandingRow(row, group)).filter(Boolean) as TeamStanding[];

    if (groups[group].length < 4) {
      throw new Error(`Group ${group} standings table did not contain four teams`);
    }
  }

  return groups;
}

export function parseGroupMatches(document: Document): Record<GroupLetter, GroupMatch[]> {
  const groups = {} as Record<GroupLetter, GroupMatch[]>;

  for (const group of GROUPS) {
    const heading = findHeading(document, `Group ${group}`);
    if (!heading) {
      throw new Error(`Could not find match list for Group ${group}`);
    }

    const matches: GroupMatch[] = [];
    let current = heading.nextElementSibling;

    while (current && !current.matches(".mw-heading")) {
      if (current.matches(".footballbox")) {
        const match = parseFootballBox(current, group, matches.length);
        if (match) {
          matches.push(match);
        }
      }
      current = current.nextElementSibling;
    }

    groups[group] = matches;
  }

  return groups;
}

export function parseThirdPlaceRanking(document: Document): ThirdPlaceRanking[] {
  const heading = findHeading(document, "Ranking of third-placed teams");
  const table = heading ? nextWikitable(heading) : null;
  if (!table) {
    throw new Error("Could not find ranking of third-placed teams table");
  }

  return Array.from(table.querySelectorAll("tbody tr"))
    .filter((row) => row.querySelector("td"))
    .map((row, index) => {
      const cells = cellTexts(row);
      const offset = cells[0] && /^\d+$/.test(cells[0]) ? 0 : -1;
      const rank = toNumber(cells[0 + offset]) || index + 1;
      const group = (cells[1 + offset] || "").match(/[A-L]/)?.[0] as GroupLetter | undefined;
      const team = cleanTeamName(cells[2 + offset] || `Third place Group ${group ?? "?"}`);

      if (!group) {
        throw new Error("Third-place ranking table has a row without a group letter");
      }

      return {
        rank,
        group,
        team,
        played: toNumber(cells[3 + offset]),
        wins: toNumber(cells[4 + offset]),
        draws: toNumber(cells[5 + offset]),
        losses: toNumber(cells[6 + offset]),
        goalsFor: toNumber(cells[7 + offset]),
        goalsAgainst: toNumber(cells[8 + offset]),
        goalDifference: parseGoalDifference(cells[9 + offset]),
        points: toNumber(cells[10 + offset]),
        qualified: rank <= 8
      };
    });
}

export function parseThirdPlaceCombinations(document: Document): ThirdPlaceCombination[] {
  const heading = findHeading(document, "Combinations of matches in the round of 32");
  const table = heading ? nextWikitable(heading) : null;
  if (!table) {
    throw new Error("Could not find third-place combination table");
  }

  return Array.from(table.querySelectorAll("tbody tr"))
    .filter((row) => row.querySelector("td"))
    .map((row) => {
      const cells = cellTexts(row);
      const groupLetters = cells.filter((cell) => /^[A-L]$/.test(cell)).slice(0, 8);
      const assignments = cells.filter((cell) => /^3[A-L]$/.test(cell)).slice(0, 8);

      if (groupLetters.length !== 8 || assignments.length !== 8) {
        return null;
      }

      return {
        key: groupLetters.sort().join(""),
        slotAssignments: Object.fromEntries(THIRD_PLACE_SLOTS.map((slot, index) => [slot, assignments[index]]))
      };
    })
    .filter(Boolean) as ThirdPlaceCombination[];
}

export function parseRoundOf32(document: Document): KnockoutMatch[] {
  const section = findHeading(document, "Round of 32");
  if (!section) {
    return fallbackRoundOf32();
  }

  const matches: KnockoutMatch[] = [];
  let current = section.nextElementSibling;

  while (current && !/^H2$/i.test(current.tagName)) {
    if (/^H3$/i.test(current.tagName)) {
      const title = text(current);
      const slots = title.split(/\s+vs\s+/i).map(normalizeSlot);
      const meta = extractMatchMeta(current);
      const matchNumber = meta.matchNumber ?? inferMatchNumber(slots[0], slots[1]);

      if (matchNumber && slots.length === 2) {
        matches.push({
          matchNumber,
          round: "Round of 32",
          date: meta.date,
          time: meta.time,
          venue: meta.venue,
          homeSlot: slots[0],
          awaySlot: slots[1],
          resolvedHomeTeam: slots[0],
          resolvedAwayTeam: slots[1]
        });
      }
    }

    current = current.nextElementSibling;
  }

  const byNumber = new Map(matches.map((match) => [match.matchNumber, match]));
  return ROUND_OF_32_SCHEDULE.map(([number, homeSlot, awaySlot]) => {
    const parsed = byNumber.get(number);
    return {
      matchNumber: number,
      round: "Round of 32",
      date: parsed?.date ?? "",
      time: parsed?.time ?? "",
      venue: parsed?.venue ?? "",
      homeSlot,
      awaySlot,
      resolvedHomeTeam: homeSlot,
      resolvedAwayTeam: awaySlot
    };
  });
}

export function buildLaterRounds(): KnockoutMatch[] {
  return LATER_ROUNDS.map(([matchNumber, round, homeSlot, awaySlot]) => ({
    matchNumber,
    round,
    date: "",
    time: "",
    venue: "",
    homeSlot,
    awaySlot,
    resolvedHomeTeam: homeSlot,
    resolvedAwayTeam: awaySlot
  }));
}

export function extractSourceUpdatedText(document: Document): string | undefined {
  const textContent = document.body.textContent ?? "";
  return textContent.match(/Updated to match\(es\) played on [^.]+\./)?.[0];
}

function parseStandingRow(row: Element, group: GroupLetter): TeamStanding | null {
  const cells = cellTexts(row);
  if (cells.length < 10 || !/^\d+$/.test(cells[0])) {
    return null;
  }

  return {
    group,
    position: toNumber(cells[0]),
    team: cleanTeamName(cells[1]),
    played: toNumber(cells[2]),
    wins: toNumber(cells[3]),
    draws: toNumber(cells[4]),
    losses: toNumber(cells[5]),
    goalsFor: toNumber(cells[6]),
    goalsAgainst: toNumber(cells[7]),
    goalDifference: parseGoalDifference(cells[8]),
    points: toNumber(cells[9]),
    note: cells.slice(10).join(" ")
  };
}

function parseFootballBox(box: Element, group: GroupLetter, index: number): GroupMatch | null {
  const homeTeam = cleanTeamName(text(box.querySelector(".fhome [itemprop='name']") ?? box.querySelector(".fhome") ?? box));
  const awayTeam = cleanTeamName(text(box.querySelector(".faway [itemprop='name']") ?? box.querySelector(".faway") ?? box));
  const scoreText = text(box.querySelector(".fscore") ?? box);
  const score = scoreText.match(/(\d+)\s*[–-]\s*(\d+)/);
  const matchNumber = Number(scoreText.match(/Match\s+(\d+)/i)?.[1]) || undefined;

  if (!homeTeam || !awayTeam) {
    return null;
  }

  return {
    id: `${group}-${index + 1}`,
    group,
    matchNumber,
    date: text(box.querySelector(".fdate") ?? box).replace(/\s+\(.*\)$/, ""),
    time: text(box.querySelector(".ftime") ?? box),
    venue: optionalText(box.querySelector(".flocation") ?? box.querySelector(".fright")),
    homeTeam,
    awayTeam,
    homeScore: score ? Number(score[1]) : undefined,
    awayScore: score ? Number(score[2]) : undefined,
    played: Boolean(score)
  };
}

function findHeading(document: Document, label: string): Element | null {
  const normalized = normalizeText(label);
  return (
    Array.from(document.querySelectorAll(".mw-heading, h2, h3, h4")).find((heading) =>
      normalizeText(heading.textContent ?? "").includes(normalized)
    ) ?? null
  );
}

function nextWikitable(start: Element): HTMLTableElement | null {
  let current = start.nextElementSibling;
  while (current) {
    if (current.matches("table.wikitable")) {
      return current as HTMLTableElement;
    }
    const nested = current.querySelector("table.wikitable");
    if (nested) {
      return nested as HTMLTableElement;
    }
    if (/^H[234]$/i.test(current.tagName)) {
      return null;
    }
    if (current.matches(".mw-heading")) {
      return null;
    }
    current = current.nextElementSibling;
  }
  return null;
}

function extractMatchMeta(heading: Element): { matchNumber?: number; date: string; time: string; venue: string } {
  const details: string[] = [];
  let current = heading.nextElementSibling;

  while (current && !/^H[23]$/i.test(current.tagName)) {
    details.push(text(current));
    current = current.nextElementSibling;
  }

  const compact = details.join(" ").replace(/\s+/g, " ").trim();
  return {
    matchNumber: Number(compact.match(/Match\s+(\d+)/i)?.[1]) || undefined,
    date: compact.match(/(?:June|July)\s+\d{1,2},\s+2026/)?.[0] ?? "",
    time: compact.match(/\d{1,2}:\d{2}\s+[ap]\.m\./i)?.[0] ?? "",
    venue: compact.match(/(?:p\.m\.\s+UTC[+-]\d+\s+)(.+?)(?=$|###|Winner|Runner-up|3rd|\[)/i)?.[1]?.trim() ?? ""
  };
}

function inferMatchNumber(homeSlot: string, awaySlot: string): number | undefined {
  return ROUND_OF_32_SCHEDULE.find(([, home, away]) => home === homeSlot && away === awaySlot)?.[0];
}

function fallbackRoundOf32(): KnockoutMatch[] {
  return ROUND_OF_32_SCHEDULE.map(([matchNumber, homeSlot, awaySlot]) => ({
    matchNumber,
    round: "Round of 32",
    date: "",
    time: "",
    venue: "",
    homeSlot,
    awaySlot,
    resolvedHomeTeam: homeSlot,
    resolvedAwayTeam: awaySlot
  }));
}

function cellTexts(row: Element): string[] {
  return Array.from(row.querySelectorAll("th, td")).map((cell) => text(cell));
}

function cleanTeamName(value: string): string {
  return value
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+\([A-Z]\)$/g, "")
    .replace(/\s+based on ranking$/i, "")
    .trim();
}

function normalizeSlot(value: string): string {
  return value
    .replace(/^Best\s+/i, "")
    .replace(/3rd place Group/i, "3rd Group")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(value: string): string {
  return value.replace(/\[edit\]/gi, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function text(element: Element): string {
  return (element.textContent ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function optionalText(element: Element | null): string {
  return element ? text(element) : "";
}

function toNumber(value: string | undefined): number {
  return Number((value ?? "0").replace(/[^\d-]/g, "")) || 0;
}

function parseGoalDifference(value: string | undefined): number {
  return Number((value ?? "0").replace("+", "").replace("−", "-").replace(/[^\d-]/g, "")) || 0;
}
