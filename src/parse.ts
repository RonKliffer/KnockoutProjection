import type {
  GroupLetter,
  GroupMatch,
  KnockoutMatch,
  QualificationStatus,
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
  [89, "Round of 16", "Winner Match 74", "Winner Match 77"],
  [90, "Round of 16", "Winner Match 73", "Winner Match 75"],
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

interface MatchMeta {
  matchNumber?: number;
  date: string;
  time: string;
  kickoffAt?: string;
  venue: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  played?: boolean;
  winnerTeam?: string;
  loserTeam?: string;
}

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
  const heading = findHeading(document, /ranking of third-plac(?:e|ed) teams/);
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

export function parseQualifiedTeams(document: Document): Record<string, QualificationStatus> {
  const heading = findHeading(document, "Qualified teams");
  const table = heading ? nextWikitable(heading) : null;
  if (!table) {
    throw new Error("Could not find qualified teams table");
  }

  const rows = Array.from(table.querySelectorAll("tr"));
  const headerCells = cellTexts(rows.find((row) => cellTexts(row).some(isQualifiedTeamsHeaderCell)) ?? table);
  const normalizedHeaderCells = headerCells.map(normalizeHeaderText);
  const placedColumns = normalizedHeaderCells
    .map((cell, index) => (/^(winners|runners-up)$/.test(cell) ? index : -1))
    .filter((index) => index >= 0);
  const qualifiedColumns = normalizedHeaderCells
    .map((cell, index) =>
      (cell.includes("third-placed teams") || /^qualified\b/.test(cell) ? index : -1)
    )
    .filter((index) => index >= 0);

  if (!placedColumns.length && !qualifiedColumns.length) {
    throw new Error("Qualified teams table did not include placement columns");
  }

  const statuses: Record<string, QualificationStatus> = {};
  for (const row of rows.filter((row) => row.querySelector("td"))) {
    const cells = Array.from(row.querySelectorAll("th, td"));
    for (const index of placedColumns) {
      addQualifiedCell(statuses, cells[index], "placed");
    }
    for (const index of qualifiedColumns) {
      addQualifiedCell(statuses, cells[index], "qualified");
    }
  }

  return statuses;
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
  const metadata = parseKnockoutMetadata(document);
  const section = findHeading(document, "Round of 32");
  if (!section) {
    return fallbackRoundOf32(metadata);
  }

  for (const [matchNumber, meta] of parseRoundOf32FootballBoxMetadata(section, metadata)) {
    metadata.set(matchNumber, meta);
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
          kickoffAt: meta.kickoffAt,
          venue: meta.venue,
          homeSlot: slots[0],
          awaySlot: slots[1],
          resolvedHomeTeam: meta.homeTeam ?? slots[0],
          resolvedAwayTeam: meta.awayTeam ?? slots[1],
          ...matchResultFields(meta)
        });
      }
    }

    current = current.nextElementSibling;
  }

  const byNumber = new Map(matches.map((match) => [match.matchNumber, match]));
  return ROUND_OF_32_SCHEDULE.map(([number, homeSlot, awaySlot]) => {
    const parsed = byNumber.get(number) ?? metadata.get(number);
    return {
      matchNumber: number,
      round: "Round of 32",
      date: parsed?.date ?? "",
      time: parsed?.time ?? "",
      kickoffAt: parsed?.kickoffAt,
      venue: parsed?.venue ?? "",
      homeSlot,
      awaySlot,
      resolvedHomeTeam: parsedTeam(parsed, "home") ?? homeSlot,
      resolvedAwayTeam: parsedTeam(parsed, "away") ?? awaySlot,
      ...matchResultFields(parsed)
    };
  });
}

export function buildLaterRounds(metadata = new Map<number, MatchMeta>()): KnockoutMatch[] {
  return LATER_ROUNDS.map(([matchNumber, round, homeSlot, awaySlot]) => {
    const meta = metadata.get(matchNumber);
    return {
      ...matchMetadataFields(meta),
      matchNumber,
      round,
      homeSlot,
      awaySlot,
      resolvedHomeTeam: meta?.homeTeam ?? homeSlot,
      resolvedAwayTeam: meta?.awayTeam ?? awaySlot,
      ...matchResultFields(meta)
    };
  });
}

export function parseLaterRounds(document: Document): KnockoutMatch[] {
  return buildLaterRounds(parseKnockoutMetadata(document));
}

export function parseKickoffAt(date: string, time: string): string | undefined {
  const dateMatch = date.match(/^(June|July)\s+(\d{1,2}),\s+(2026)$/i);
  const timeMatch = time
    .replace(/\u2212/g, "-")
    .match(/(\d{1,2}):(\d{2})\s*([ap])\.?m\.?.*?UTC\s*([+-]\d{1,2})(?::?(\d{2}))?/i);

  if (!dateMatch || !timeMatch) {
    return undefined;
  }

  const month = monthIndex(dateMatch[1]);
  const day = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);
  let hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const period = timeMatch[3].toLowerCase();
  const offsetHours = Number(timeMatch[4]);
  const offsetMinutes = Number(timeMatch[5] ?? "0");

  if (month === undefined) {
    return undefined;
  }

  if (period === "p" && hour !== 12) {
    hour += 12;
  } else if (period === "a" && hour === 12) {
    hour = 0;
  }

  const offsetSign = offsetHours < 0 ? -1 : 1;
  const totalOffsetMinutes = offsetHours * 60 + offsetSign * offsetMinutes;
  return new Date(Date.UTC(year, month, day, hour, minute) - totalOffsetMinutes * 60 * 1000).toISOString();
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

  const date = text(box.querySelector(".fdate") ?? box).replace(/\s+\(.*\)$/, "");
  const time = text(box.querySelector(".ftime") ?? box);

  return {
    id: `${group}-${index + 1}`,
    group,
    matchNumber,
    date,
    time,
    kickoffAt: parseKickoffAt(date, time),
    venue: optionalText(box.querySelector(".flocation") ?? box.querySelector(".fright")),
    homeTeam,
    awayTeam,
    homeScore: score ? Number(score[1]) : undefined,
    awayScore: score ? Number(score[2]) : undefined,
    played: Boolean(score)
  };
}

function findHeading(document: Document, label: string | RegExp): Element | null {
  return (
    Array.from(document.querySelectorAll(".mw-heading, h2, h3, h4")).find((heading) => {
      const normalized = normalizeText(heading.textContent ?? "");
      return typeof label === "string" ? normalized.includes(normalizeText(label)) : label.test(normalized);
    }) ?? null
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

function parseKnockoutMetadata(document: Document): Map<number, MatchMeta> {
  const metadata = new Map<number, MatchMeta>();

  for (const meta of Array.from(document.querySelectorAll(".footballbox"))
    .map((box) => parseFootballBoxMeta(box, nearbyFixtureText(box)))
    .filter((meta): meta is MatchMeta & { matchNumber: number } => Boolean(meta.matchNumber))) {
    metadata.set(meta.matchNumber, meta);
  }

  for (const meta of Array.from(document.querySelectorAll("h3, .mw-heading"))
      .filter((heading) => /\s+vs\s+/i.test(text(heading)))
      .map((heading) => extractMatchMeta(heading))
      .filter((meta): meta is MatchMeta & { matchNumber: number } => Boolean(meta.matchNumber))) {
    if (!metadata.has(meta.matchNumber)) {
      metadata.set(meta.matchNumber, meta);
    }
  }

  return metadata;
}

function parseRoundOf32FootballBoxMetadata(section: Element, knockoutMetadata: Map<number, MatchMeta>): Map<number, MatchMeta> {
  const metadata = new Map<number, MatchMeta>();
  let current = section.nextElementSibling;
  let boxIndex = 0;
  let fixtureContext = "";
  const winnerMatchNumbers = roundOf32MatchNumbersByAdvancedTeam(knockoutMetadata);

  while (current && !/^H2$/i.test(current.tagName)) {
    if (/^H3$/i.test(current.tagName) || current.matches(".mw-heading")) {
      fixtureContext = text(current);
    }

    if (current.matches(".footballbox")) {
      const meta = parseFootballBoxMeta(current, fixtureContext);
      const fallbackMatchNumber = ROUND_OF_32_SCHEDULE[boxIndex]?.[0];
      const inferredMatchNumber = meta.winnerTeam ? winnerMatchNumbers.get(meta.winnerTeam) : undefined;
      const matchNumber = meta.matchNumber ?? inferredMatchNumber ?? fallbackMatchNumber;

      if (matchNumber) {
        metadata.set(matchNumber, { ...meta, matchNumber });
      }

      boxIndex += 1;
    }

    current = current.nextElementSibling;
  }

  return metadata;
}

function roundOf32MatchNumbersByAdvancedTeam(knockoutMetadata: Map<number, MatchMeta>): Map<string, number> {
  const matchNumbers = new Map<string, number>();

  for (const [laterMatchNumber, , homeSlot, awaySlot] of LATER_ROUNDS) {
    const meta = knockoutMetadata.get(laterMatchNumber);
    if (!meta) {
      continue;
    }

    addAdvancedTeamMatchNumber(matchNumbers, meta.homeTeam, homeSlot);
    addAdvancedTeamMatchNumber(matchNumbers, meta.awayTeam, awaySlot);
  }

  return matchNumbers;
}

function addAdvancedTeamMatchNumber(matchNumbers: Map<string, number>, team: string | undefined, slot: string): void {
  if (!team || isPlaceholderKnockoutTeam(team)) {
    return;
  }

  const roundOf32MatchNumber = Number(slot.match(/^Winner Match (\d+)$/)?.[1]);
  if (roundOf32MatchNumber && ROUND_OF_32_SCHEDULE.some(([matchNumber]) => matchNumber === roundOf32MatchNumber)) {
    matchNumbers.set(team, roundOf32MatchNumber);
  }
}

function isPlaceholderKnockoutTeam(team: string): boolean {
  return /^(winner|loser|runner-up|runner up|3rd|third place)\b/i.test(team);
}

function parseFootballBoxMeta(box: Element, fixtureContext = ""): MatchMeta {
  const date = text(box.querySelector(".fdate") ?? box).replace(/\s+\(.*\)$/, "");
  const time = text(box.querySelector(".ftime") ?? box);
  const homeCell = box.querySelector(".fhome");
  const awayCell = box.querySelector(".faway");
  const homeTeam = cleanTeamName(text(homeCell?.querySelector("[itemprop='name']") ?? homeCell ?? box));
  const awayTeam = cleanTeamName(text(awayCell?.querySelector("[itemprop='name']") ?? awayCell ?? box));
  const scoreText = text(box.querySelector(".fscore") ?? box);
  const score = scoreText.match(/(\d+)\s*[–-]\s*(\d+)/);
  const homeScore = score ? Number(score[1]) : undefined;
  const awayScore = score ? Number(score[2]) : undefined;
  const winnerTeam = determineKnockoutWinner(homeCell, awayCell, homeTeam, awayTeam, homeScore, awayScore);
  const loserTeam = winnerTeam === homeTeam ? awayTeam : winnerTeam === awayTeam ? homeTeam : undefined;

  return {
    matchNumber: extractFootballBoxMatchNumber(box, fixtureContext),
    date,
    time,
    kickoffAt: parseKickoffAt(date, time),
    venue: optionalText(box.querySelector(".flocation") ?? box.querySelector(".fright")),
    homeTeam: homeTeam || undefined,
    awayTeam: awayTeam || undefined,
    homeScore,
    awayScore,
    played: Boolean(score),
    winnerTeam,
    loserTeam
  };
}

function extractMatchMeta(heading: Element): MatchMeta {
  const details: string[] = [];
  let structuredDate = "";
  let structuredTime = "";
  let structuredVenue = "";
  let current = heading.nextElementSibling;

  while (current && !/^H[23]$/i.test(current.tagName) && !current.matches(".mw-heading")) {
    if (current.matches(".footballbox")) {
      structuredDate ||= text(current.querySelector(".fdate") ?? current).replace(/\s+\(.*\)$/, "");
      structuredTime ||= text(current.querySelector(".ftime") ?? current);
      structuredVenue ||= optionalText(current.querySelector(".flocation") ?? current.querySelector(".fright"));
    }

    if (!/^STYLE$/i.test(current.tagName)) {
      details.push(text(current));
    }

    current = current.nextElementSibling;
  }

  const compact = details.join(" ").replace(/\s+/g, " ").trim();
  const date = structuredDate || compact.match(/(?:June|July)\s+\d{1,2},\s+2026/)?.[0] || "";
  const time = structuredTime || compact.match(/\d{1,2}:\d{2}\s+[ap]\.m\.\s+UTC\s*[+\-\u2212]\d+(?::?\d{2})?/i)?.[0] || "";

  return {
    matchNumber: extractFixtureMatchNumber(heading, compact),
    date,
    time,
    kickoffAt: parseKickoffAt(date, time),
    venue: structuredVenue || extractVenue(details)
  };
}

function inferMatchNumber(homeSlot: string, awaySlot: string): number | undefined {
  return ROUND_OF_32_SCHEDULE.find(([, home, away]) => home === homeSlot && away === awaySlot)?.[0];
}

function extractFixtureMatchNumber(heading: Element, details: string): number | undefined {
  const headingNumbers = new Set(matchNumbers(text(heading)));
  return matchNumbers(details).find((number) => !headingNumbers.has(number)) ?? matchNumbers(details)[0];
}

function extractFootballBoxMatchNumber(box: Element, fixtureContext: string): number | undefined {
  const scoreNumbers = matchNumbers(text(box.querySelector(".fscore") ?? box));
  if (scoreNumbers.length) {
    return scoreNumbers[0];
  }

  const boxNumbers = matchNumbers(text(box));
  if (!boxNumbers.length) {
    return undefined;
  }

  const contextNumbers = new Set(matchNumbers(fixtureContext));
  return boxNumbers.find((number) => !contextNumbers.has(number)) ?? boxNumbers[0];
}

function nearbyFixtureText(element: Element): string {
  let current = element.previousElementSibling;
  while (current) {
    if (/^H[23]$/i.test(current.tagName) || current.matches(".mw-heading")) {
      return text(current);
    }

    current = current.previousElementSibling;
  }

  return "";
}

function matchNumbers(value: string): number[] {
  return Array.from(value.matchAll(/Match\s+(\d+)/gi)).map((match) => Number(match[1]));
}

function extractVenue(details: string[]): string {
  return (
    details.find((detail) => {
      return (
        detail &&
        !/(?:June|July)\s+\d{1,2},\s+2026/i.test(detail) &&
        !/\d{1,2}:\d{2}\s+[ap]\.m\./i.test(detail) &&
        !/\b(?:Winner|Loser|Runner-up|3rd)\b/i.test(detail) &&
        !/Match\s+\d+/i.test(detail) &&
        !/[\{\}]/.test(detail) &&
        !/\[edit\]/i.test(detail)
      );
    }) ?? ""
  );
}

function fallbackRoundOf32(metadata = new Map<number, MatchMeta>()): KnockoutMatch[] {
  return ROUND_OF_32_SCHEDULE.map(([matchNumber, homeSlot, awaySlot]) => {
    const meta = metadata.get(matchNumber);
    return {
      ...matchMetadataFields(meta),
      matchNumber,
      round: "Round of 32",
      homeSlot,
      awaySlot,
      resolvedHomeTeam: meta?.homeTeam ?? homeSlot,
      resolvedAwayTeam: meta?.awayTeam ?? awaySlot,
      ...matchResultFields(meta)
    };
  });
}

function matchMetadataFields(meta: MatchMeta | undefined): Pick<KnockoutMatch, "date" | "time" | "kickoffAt" | "venue"> {
  return {
    date: meta?.date ?? "",
    time: meta?.time ?? "",
    kickoffAt: meta?.kickoffAt,
    venue: meta?.venue ?? ""
  };
}

function matchResultFields(
  meta: MatchMeta | undefined
): Pick<KnockoutMatch, "homeScore" | "awayScore" | "played" | "winnerTeam" | "loserTeam"> {
  return {
    homeScore: meta?.homeScore,
    awayScore: meta?.awayScore,
    played: meta?.played,
    winnerTeam: meta?.winnerTeam,
    loserTeam: meta?.loserTeam
  };
}

function parsedTeam(parsed: KnockoutMatch | MatchMeta | undefined, side: "home" | "away"): string | undefined {
  if (!parsed) {
    return undefined;
  }

  if ("resolvedHomeTeam" in parsed) {
    return side === "home" ? parsed.resolvedHomeTeam : parsed.resolvedAwayTeam;
  }

  return side === "home" ? parsed.homeTeam : parsed.awayTeam;
}

function cellTexts(row: Element): string[] {
  return Array.from(row.querySelectorAll("th, td")).map((cell) => text(cell));
}

function addQualifiedCell(
  statuses: Record<string, QualificationStatus>,
  cell: Element | undefined,
  status: Exclude<QualificationStatus, "unqualified">
): void {
  for (const team of qualifiedCellTeamNames(cell)) {
    statuses[team] = statuses[team] === "placed" ? "placed" : status;
  }
}

function qualifiedCellTeamNames(cell: Element | undefined): string[] {
  if (!cell) {
    return [];
  }

  const linkedTeams = uniqueNames(Array.from(cell.querySelectorAll("a")).map((link) => cleanTeamName(text(link))));
  if (linkedTeams.length) {
    return linkedTeams;
  }

  return uniqueNames(cell.innerHTML
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map(cleanTeamName));
}

function uniqueNames(names: string[]): string[] {
  return Array.from(new Set(names.filter(Boolean)));
}

function determineKnockoutWinner(
  homeCell: Element | null,
  awayCell: Element | null,
  homeTeam: string,
  awayTeam: string,
  homeScore: number | undefined,
  awayScore: number | undefined
): string | undefined {
  if (homeScore !== undefined && awayScore !== undefined && homeScore !== awayScore) {
    return homeScore > awayScore ? homeTeam : awayTeam;
  }

  if (isMarkedWinner(homeCell)) {
    return homeTeam || undefined;
  }

  if (isMarkedWinner(awayCell)) {
    return awayTeam || undefined;
  }

  return undefined;
}

function isMarkedWinner(cell: Element | null): boolean {
  if (!cell) {
    return false;
  }

  const classText = cell.getAttribute("class") ?? "";
  return /\bwinner\b/i.test(classText) || Boolean(cell.querySelector(".winner, b, strong"));
}

function cleanTeamName(value: string): string {
  return value
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+\([A-Z](?:\s*,\s*[A-Z])*\)$/g, "")
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

function isQualifiedTeamsHeaderCell(value: string): boolean {
  const header = normalizeHeaderText(value);
  return /^(winners|runners-up|qualified)\b/.test(header) || /\bthird-placed teams\b/.test(header);
}

function normalizeHeaderText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
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

function monthIndex(month: string): number | undefined {
  const months: Record<string, number> = { june: 5, july: 6 };
  return months[month.toLowerCase()];
}
