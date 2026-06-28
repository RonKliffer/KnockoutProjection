import {
  extractSourceUpdatedText,
  parseGroupMatches,
  parseGroupStandings,
  parseHtml,
  parseLaterRounds,
  parseQualifiedTeams,
  parseRoundOf32,
  parseThirdPlaceCombinations,
  parseThirdPlaceRanking
} from "./parse";
import { buildBracketLayout, buildConnectorPath } from "./bracketLayout";
import { buildKnockoutSchedule } from "./knockoutSchedule";
import { buildProjection } from "./projection";
import { buildSimulatedGroups, buildSimulatedThirdPlaceRanking } from "./simulation";
import { teamFlag } from "./flags";
import { formatMatchSchedule } from "./timeFormat";
import type {
  GroupLetter,
  GroupMatch,
  KnockoutMatch,
  QualificationStatus,
  TeamStanding,
  ThirdPlaceRanking,
  TournamentData,
  UserResult
} from "./types";
import { fetchWikipediaHtml } from "./wikipedia";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const THIRD_PLACE_RANKING_TABLE_ERROR = "Could not find ranking of third-placed teams table";

interface AppState {
  data?: TournamentData;
  error?: string;
  loading: boolean;
  stale: boolean;
  userResults: Record<string, UserResult>;
}

export function mountApp(root: HTMLElement): void {
  const state: AppState = { loading: true, stale: false, userResults: {} };
  window.addEventListener("resize", () => scheduleBracketConnectorUpdate(root));

  const refresh = async (options: { clearUserResults?: boolean } = {}) => {
    if (options.clearUserResults) {
      state.userResults = {};
    }
    state.loading = true;
    state.error = undefined;
    render(root, state, refresh);

    try {
      state.data = await loadTournamentData();
      state.stale = false;
    } catch (error) {
      state.error = error instanceof Error ? error.message : "Unable to load tournament data";
      state.stale = Boolean(state.data);
    } finally {
      state.loading = false;
      render(root, state, refresh);
    }
  };

  render(root, state, refresh);
  void refresh();
  window.setInterval(refresh, REFRESH_INTERVAL_MS);
}

export async function loadTournamentData(): Promise<TournamentData> {
  const [groupHtml, knockoutHtml] = await Promise.all([
    fetchWikipediaHtml("2026_FIFA_World_Cup"),
    fetchWikipediaHtml("2026_FIFA_World_Cup_knockout_stage")
  ]);

  const groupDocument = parseHtml(groupHtml);
  const knockoutDocument = parseHtml(knockoutHtml);
  const groups = parseGroupStandings(groupDocument);
  const groupMatches = parseGroupMatches(groupDocument);
  const thirdPlaceRanking = resolveThirdPlaceRanking(groupDocument, groups);
  const combinations = parseThirdPlaceCombinations(knockoutDocument);
  const roundOf32 = parseRoundOf32(knockoutDocument);
  const laterRounds = parseLaterRounds(knockoutDocument);
  const qualificationStatuses = parseQualifiedTeams(knockoutDocument);

  return {
    groups,
    groupMatches,
    knockoutCombinations: combinations,
    roundOf32,
    thirdPlaceRanking,
    qualificationStatuses,
    projection: buildProjection(groups, thirdPlaceRanking, combinations, roundOf32, laterRounds),
    fetchedAt: new Date(),
    sourceUpdatedText: extractSourceUpdatedText(groupDocument)
  };
}

export function resolveThirdPlaceRanking(
  groupDocument: Document,
  groups: Record<GroupLetter, TeamStanding[]>
): ThirdPlaceRanking[] {
  try {
    return parseThirdPlaceRanking(groupDocument);
  } catch (error) {
    if (error instanceof Error && error.message === THIRD_PLACE_RANKING_TABLE_ERROR) {
      return buildSimulatedThirdPlaceRanking(groups, []);
    }

    throw error;
  }
}

function render(root: HTMLElement, state: AppState, onRefresh: (options?: { clearUserResults?: boolean }) => void): void {
  const data = state.data ? applyUserResults(state.data, state.userResults) : undefined;

  root.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">World Cup 2026</p>
          <h1>Knockout projection</h1>
        </div>
        <div class="status-panel">
          <button class="refresh-button" type="button" ${state.loading ? "disabled" : ""}>
            <span aria-hidden="true">Refresh</span>
          </button>
          <p class="timestamp">${timestampText(state)}</p>
        </div>
      </header>

      ${state.error ? `<section class="notice ${state.stale ? "warning" : "error"}">${escapeHtml(state.error)}</section>` : ""}
      ${state.loading && !state.data ? `<section class="notice">Loading live Wikipedia data...</section>` : ""}

      ${
        data
          ? `
        <section class="page-stack">
          <section class="bracket-panel">
          <div class="section-heading">
            <h2>Projected bracket</h2>
            <div class="heading-note-stack">
              <p>Third-place groups: ${data.projection.thirdPlaceKey.split("").join(", ")}</p>
              <p>Times in your local timezone</p>
            </div>
          </div>
          ${renderBracket(data.projection.roundOf32, data.projection.laterRounds, data.qualificationStatuses)}
          ${renderKnockoutSchedule(data.projection.roundOf32, data.projection.laterRounds, data.qualificationStatuses)}
        </section>
        <section class="standings-panel">
          <div class="section-heading">
            <h2>Group tables</h2>
            <p>${escapeHtml(data.sourceUpdatedText ?? "Standings pulled from Wikipedia.")}</p>
          </div>
          <div class="standings-layout">
            ${renderThirdPlace(data)}
            ${renderGroups(data.groups)}
          </div>
        </section>
        <section class="results-panel">
          <div class="section-heading results-heading">
            <div>
              <h2>Group results</h2>
              <p>Enter scores for unplayed matches to update the standings and bracket.</p>
            </div>
          </div>
          ${renderGroupResults(data.groupMatches, state.userResults)}
        </section>
        </section>
      `
          : ""
      }
    </main>
  `;

  scheduleBracketConnectorUpdate(root);
  root.querySelector<HTMLButtonElement>(".refresh-button")?.addEventListener("click", () => onRefresh({ clearUserResults: true }));
  root.querySelectorAll<HTMLInputElement>(".score-input").forEach((input) => {
    input.addEventListener("input", () => {
      const matchId = input.dataset.matchId;
      const side = input.dataset.side as "homeScore" | "awayScore" | undefined;
      if (!matchId || !side) {
        return;
      }

      const nextResult = { ...(state.userResults[matchId] ?? {}) };
      const parsed = input.value === "" ? undefined : Number(input.value);
      nextResult[side] = Number.isFinite(parsed) && parsed !== undefined ? parsed : undefined;

      if (nextResult.homeScore === undefined && nextResult.awayScore === undefined) {
        delete state.userResults[matchId];
      } else {
        state.userResults[matchId] = nextResult;
      }

      render(root, state, onRefresh);
      root
        .querySelector<HTMLInputElement>(`.score-input[data-match-id="${matchId}"][data-side="${side}"]`)
        ?.focus();
    });
  });
}

function scheduleBracketConnectorUpdate(root: HTMLElement): void {
  window.requestAnimationFrame(() => updateBracketConnectors(root));
}

function applyUserResults(data: TournamentData, userResults: Record<string, UserResult>): TournamentData {
  const groups = buildSimulatedGroups(data.groups, data.groupMatches, userResults);
  const thirdPlaceRanking = buildSimulatedThirdPlaceRanking(groups, data.thirdPlaceRanking);

  return {
    ...data,
    groups,
    thirdPlaceRanking,
    projection: buildProjection(groups, thirdPlaceRanking, data.knockoutCombinations, data.roundOf32, data.projection.laterRounds)
  };
}

function renderBracket(
  roundOf32: KnockoutMatch[],
  laterRounds: KnockoutMatch[],
  qualificationStatuses: Record<string, QualificationStatus>
): string {
  const { leftRounds, rightRounds, finals, connections } = buildBracketLayout(roundOf32, laterRounds);

  return `
    <div class="bracket-scroll">
      <div class="bracket-stage" data-connections="${escapeHtml(JSON.stringify(connections))}">
        <svg class="bracket-connectors" aria-hidden="true"></svg>
        <div class="bracket-half bracket-half-left">
          ${leftRounds.map((round, roundIndex) => renderRound(round.label, round.matches, roundIndex + 1, "left", qualificationStatuses)).join("")}
        </div>
        <section class="final-column">
          <h3>Final</h3>
          <div class="final-list">
            ${finals.map((match) => renderMatch(match, "center", qualificationStatuses)).join("")}
          </div>
        </section>
        <div class="bracket-half bracket-half-right">
          ${rightRounds.map((round, roundIndex) => renderRound(round.label, round.matches, 4 - roundIndex, "right", qualificationStatuses)).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderRound(
  label: string,
  matches: KnockoutMatch[],
  depth: number,
  side: "left" | "right",
  qualificationStatuses: Record<string, QualificationStatus>
): string {
  return `
    <section class="round-column round-depth-${depth} ${side === "right" ? "round-mirrored" : ""}">
      <h3>${label}</h3>
      <div class="match-list">
        ${matches.map((match) => renderMatch(match, side, qualificationStatuses)).join("")}
      </div>
    </section>
  `;
}

function renderMatch(
  match: KnockoutMatch,
  side: "left" | "right" | "center" = "left",
  qualificationStatuses: Record<string, QualificationStatus>
): string {
  const schedule = formatMatchSchedule({ ...match, venue: undefined });
  const venue = bracketVenueText(match.venue);
  const flowClass =
    side === "center" ? "center-match" : side === "left" ? "flows-right" : "flows-left";
  const showSlotSubtitle = match.round === "Round of 32";
  return `
    <article class="match-card ${flowClass}" data-match-number="${match.matchNumber}">
      <div class="match-meta">
        <span>Match ${match.matchNumber}</span>
      </div>
      <div class="team-row">
        <strong>${renderBracketTeamName(match.resolvedHomeTeam, qualificationStatuses)}</strong>
        ${showSlotSubtitle ? `<small>${escapeHtml(match.homeSlot)}</small>` : ""}
      </div>
      <div class="team-row">
        <strong>${renderBracketTeamName(match.resolvedAwayTeam, qualificationStatuses)}</strong>
        ${showSlotSubtitle ? `<small>${escapeHtml(match.awaySlot)}</small>` : ""}
      </div>
      ${schedule ? `<p class="venue">${escapeHtml(schedule)}</p>` : ""}
      ${venue ? `<p class="match-venue">${escapeHtml(venue)}</p>` : ""}
    </article>
  `;
}

function renderKnockoutSchedule(
  roundOf32: KnockoutMatch[],
  laterRounds: KnockoutMatch[],
  qualificationStatuses: Record<string, QualificationStatus>
): string {
  const stages = buildKnockoutSchedule(roundOf32, laterRounds);

  return `
    <section class="knockout-schedule">
      <div class="section-heading schedule-heading">
        <h2>Knockout matches</h2>
      </div>
      <div class="schedule-stage-list">
        ${stages.map((stage) => renderScheduleStage(stage.round, stage.matches, qualificationStatuses)).join("")}
      </div>
    </section>
  `;
}

function renderScheduleStage(
  round: string,
  matches: KnockoutMatch[],
  qualificationStatuses: Record<string, QualificationStatus>
): string {
  return `
    <section class="schedule-stage">
      <h3>${escapeHtml(round)}</h3>
      <div class="schedule-match-list">
        ${matches.map((match) => renderScheduleMatch(match, qualificationStatuses)).join("")}
      </div>
    </section>
  `;
}

function renderScheduleMatch(match: KnockoutMatch, qualificationStatuses: Record<string, QualificationStatus>): string {
  const schedule = formatMatchSchedule({ ...match, venue: undefined });
  const venue = bracketVenueText(match.venue);

  return `
    <article class="schedule-match">
      <div class="schedule-match-meta">
        <span>Match ${match.matchNumber}</span>
        ${schedule ? `<time>${escapeHtml(schedule)}</time>` : ""}
      </div>
      <div class="schedule-teams">
        <strong>${renderBracketTeamName(match.resolvedHomeTeam, qualificationStatuses)}</strong>
        <span>vs</span>
        <strong>${renderBracketTeamName(match.resolvedAwayTeam, qualificationStatuses)}</strong>
      </div>
      ${venue ? `<p>${escapeHtml(venue)}</p>` : ""}
    </article>
  `;
}

function bracketVenueText(venue: string): string {
  return venue.replace(/\s*(?:referee|officials?)\b.*$/i, "").trim();
}

function renderBracketTeamName(teamName: string, qualificationStatuses: Record<string, QualificationStatus>): string {
  const flag = teamFlag(teamName);
  const status = qualificationStatuses[teamName] ?? "unqualified";
  return `${flag ? `<span class="team-flag bracket-team-${status}" aria-hidden="true">${flag}</span>` : ""}<span class="bracket-team-${status}">${escapeHtml(teamName)}</span>`;
}

function updateBracketConnectors(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>(".bracket-stage").forEach((stage) => {
    const svg = stage.querySelector<SVGSVGElement>(".bracket-connectors");
    if (!svg) {
      return;
    }

    const connections = parseBracketConnections(stage.dataset.connections);
    const stageRect = stage.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.replaceChildren(
      ...connections.flatMap((connection) => {
        const fromCard = stage.querySelector<HTMLElement>(`.match-card[data-match-number="${connection.fromMatchNumber}"]`);
        const toCard = stage.querySelector<HTMLElement>(`.match-card[data-match-number="${connection.toMatchNumber}"]`);

        if (!fromCard || !toCard) {
          return [];
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", buildConnectorPath(relativeRect(fromCard, stageRect), relativeRect(toCard, stageRect)));
        path.dataset.fromMatch = String(connection.fromMatchNumber);
        path.dataset.toMatch = String(connection.toMatchNumber);
        return [path];
      })
    );
  });
}

function parseBracketConnections(value: string | undefined): Array<{ fromMatchNumber: number; toMatchNumber: number }> {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function relativeRect(element: HTMLElement, parentRect: DOMRect): { left: number; top: number; width: number; height: number } {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - parentRect.left,
    top: rect.top - parentRect.top,
    width: rect.width,
    height: rect.height
  };
}

function renderThirdPlace(data: TournamentData): string {
  return `
    <section class="third-place-block">
      <h3>Third-place ranking</h3>
      <div class="third-place-list">
        <div class="third-row third-row-header">
          <span></span>
          <span>Team</span>
          <span>Group</span>
          <span>MP</span>
          <span>Pts</span>
          <span>GD</span>
        </div>
        ${data.thirdPlaceRanking
          .map(
            (entry) => `
              <div class="third-row ${entry.qualified ? "qualified" : ""}">
                <span>${entry.rank}</span>
                <strong>${escapeHtml(entry.team)}</strong>
                <small>Group ${entry.group}</small>
                <b>${entry.played}</b>
                <b>${entry.points}</b>
                <b>${formatGoalDifference(entry.goalDifference)}</b>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderGroups(groups: Record<GroupLetter, TeamStanding[]>): string {
  return `
    <div class="groups-grid">
      ${Object.entries(groups)
        .map(
          ([group, standings]) => `
            <section class="group-card">
              <h3>Group ${group}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Team</th>
                    <th>MP</th>
                    <th>Pts</th>
                    <th>GD</th>
                  </tr>
                </thead>
                <tbody>
                  ${standings
                    .map(
                      (team) => `
                        <tr>
                          <td>${team.position}</td>
                          <td>${escapeHtml(team.team)}</td>
                          <td>${team.played}</td>
                          <td>${team.points}</td>
                          <td>${formatGoalDifference(team.goalDifference)}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function renderGroupResults(
  groupMatches: Record<GroupLetter, GroupMatch[]>,
  userResults: Record<string, UserResult>
): string {
  return `
    <div class="results-grid">
      ${Object.entries(groupMatches)
        .map(
          ([group, matches]) => `
            <section class="results-group">
              <div class="results-group-heading">
                <h3>Group ${group}</h3>
              </div>
              <div class="results-list">
                ${matches.map((match) => renderGroupMatch(match, userResults[match.id])).join("")}
              </div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function renderGroupMatch(match: GroupMatch, userResult?: UserResult): string {
  const homeValue = match.played ? match.homeScore : userResult?.homeScore;
  const awayValue = match.played ? match.awayScore : userResult?.awayScore;
  const matchLabel = match.matchNumber ? `Match ${match.matchNumber}` : match.played ? "Played" : "Scheduled";

  return `
    <article class="result-card ${match.played ? "played" : "editable"}">
      <div class="result-meta">
        <span>${matchLabel}</span>
        <span>${match.played ? "FT" : "Prediction"}</span>
      </div>
      <div class="result-line">
        <span class="result-team">${escapeHtml(match.homeTeam)}</span>
        ${
          match.played
            ? `<strong class="result-score">${homeValue ?? "-"}-${awayValue ?? "-"}</strong>`
            : `
              <div class="score-editor" aria-label="${escapeHtml(match.homeTeam)} vs ${escapeHtml(match.awayTeam)} prediction">
                <input class="score-input" data-match-id="${match.id}" data-side="homeScore" type="number" inputmode="numeric" min="0" max="30" value="${homeValue ?? ""}" aria-label="${escapeHtml(match.homeTeam)} score" />
                <span>-</span>
                <input class="score-input" data-match-id="${match.id}" data-side="awayScore" type="number" inputmode="numeric" min="0" max="30" value="${awayValue ?? ""}" aria-label="${escapeHtml(match.awayTeam)} score" />
              </div>
            `
        }
        <span class="result-team away">${escapeHtml(match.awayTeam)}</span>
      </div>
      ${!match.played ? `<p class="fixture-time">${escapeHtml(formatMatchSchedule({ ...match, venue: undefined }))}</p>` : ""}
    </article>
  `;
}

function timestampText(state: AppState): string {
  if (state.loading && !state.data) {
    return "Fetching live data";
  }

  if (!state.data) {
    return "No data loaded";
  }

  const prefix = state.stale ? "Showing cached data from" : "Last updated";
  return `${prefix} ${state.data.fetchedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function formatGoalDifference(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return replacements[character];
  });
}
