import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import {
  parseKickoffAt,
  parseLaterRounds,
  parseGroupMatches,
  parseGroupStandings,
  parseQualifiedTeams,
  parseRoundOf32,
  parseThirdPlaceCombinations,
  parseThirdPlaceRanking
} from "./parse";
import { buildSimulatedGroups } from "./simulation";

function doc(html: string): Document {
  return new JSDOM(html).window.document;
}

const groupsHtml = `
  ${["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
    .map(
      (group) => `
      <h3>Group ${group}</h3>
      <table class="wikitable">
        <tbody>
          <tr><th>Pos</th><th>Team</th><th>Pld</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          <tr><td>1</td><td>${group} Winner</td><td>1</td><td>1</td><td>0</td><td>0</td><td>2</td><td>0</td><td>+2</td><td>3</td></tr>
          <tr><td>2</td><td>${group} Runner</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
          <tr><td>3</td><td>${group} Third</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
          <tr><td>4</td><td>${group} Fourth</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>2</td><td>-2</td><td>0</td></tr>
        </tbody>
      </table>
    `
    )
    .join("")}
  <h3>Ranking of third-placed teams</h3>
  <table class="wikitable">
    <tbody>
      <tr><th>Pos</th><th>Grp</th><th>Team</th><th>Pld</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
      ${["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
        .map(
          (group, index) =>
            `<tr><td>${index + 1}</td><td>${group}</td><td>${group} Third</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>`
        )
        .join("")}
    </tbody>
  </table>
`;

describe("Wikipedia parsers", () => {
  it("extracts group standings", () => {
    const groups = parseGroupStandings(doc(groupsHtml));
    expect(groups.A[0].team).toBe("A Winner");
    expect(groups.L[2].team).toBe("L Third");
  });

  it("normalizes standings status markers to match football box team names", () => {
    const document = doc(`
      <h3>Group A</h3>
      <table class="wikitable">
        <tbody>
          <tr><th>Pos</th><th>Team</th><th>Pld</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          <tr><td>1</td><td>Mexico (H, Q)</td><td>2</td><td>2</td><td>0</td><td>0</td><td>3</td><td>0</td><td>+3</td><td>6</td></tr>
          <tr><td>2</td><td>South Korea</td><td>2</td><td>1</td><td>0</td><td>1</td><td>2</td><td>2</td><td>0</td><td>3</td></tr>
          <tr><td>3</td><td>Czech Republic</td><td>2</td><td>0</td><td>1</td><td>1</td><td>2</td><td>3</td><td>-1</td><td>1</td></tr>
          <tr><td>4</td><td>South Africa</td><td>2</td><td>0</td><td>1</td><td>1</td><td>1</td><td>3</td><td>-2</td><td>1</td></tr>
        </tbody>
      </table>
      <div class="footballbox">
        <span class="fdate">June 11, 2026</span>
        <span class="ftime">8:00 p.m. UTC−6</span>
        <table class="fevent">
          <tr>
            <td class="fhome">Mexico</td>
            <td class="fscore">2–0</td>
            <td class="faway">South Africa</td>
          </tr>
        </table>
      </div>
      <div class="footballbox">
        <span class="fdate">June 18, 2026</span>
        <span class="ftime">8:00 p.m. UTC−6</span>
        <table class="fevent">
          <tr>
            <td class="fhome">Mexico</td>
            <td class="fscore">1–0</td>
            <td class="faway">South Korea</td>
          </tr>
        </table>
      </div>
      ${["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
        .map(
          (group) => `
            <h3>Group ${group}</h3>
            <table class="wikitable">
              <tbody>
                <tr><th>Pos</th><th>Team</th><th>Pld</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
                <tr><td>1</td><td>${group} Winner</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>2</td><td>${group} Runner</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>3</td><td>${group} Third</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>4</td><td>${group} Fourth</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
              </tbody>
            </table>
          `
        )
        .join("")}
    `);
    const groups = parseGroupStandings(document);
    const matches = parseGroupMatches(document);
    const simulated = buildSimulatedGroups(groups, matches, {});
    const mexico = simulated.A.find((team) => team.team === "Mexico");

    expect(groups.A[0].team).toBe("Mexico");
    expect(matches.A[0].homeTeam).toBe("Mexico");
    expect(mexico).toMatchObject({
      played: 2,
      points: 6,
      goalsFor: 3,
      goalsAgainst: 0
    });
  });

  it("extracts third-place ranking", () => {
    const ranking = parseThirdPlaceRanking(doc(groupsHtml));
    expect(ranking).toHaveLength(12);
    expect(ranking[0]).toMatchObject({ group: "A", qualified: true });
    expect(ranking[8]).toMatchObject({ group: "I", qualified: false });
  });

  it("extracts qualified team placement statuses", () => {
    const statuses = parseQualifiedTeams(
      doc(`
        <h2>Qualified teams</h2>
        <table class="wikitable">
          <tbody>
            <tr>
              <th>Group</th>
              <th>Winners</th>
              <th>Runners-up</th>
              <th>Third-placed teams<br>(Best eight qualify)</th>
              <th>Qualified<br>(position TBD)</th>
            </tr>
            <tr>
              <th>A</th>
              <td>Mexico (H, Q)</td>
              <td>South Africa</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>B</th>
              <td>Switzerland</td>
              <td>Canada</td>
              <td>Bosnia and Herzegovina</td>
              <td></td>
            </tr>
            <tr>
              <th>I</th>
              <td></td>
              <td></td>
              <td></td>
              <td><a href="/wiki/France_national_football_team">France</a><br><a href="/wiki/Norway_national_football_team">Norway</a></td>
            </tr>
          </tbody>
        </table>
      `)
    );

    expect(statuses).toEqual({
      Mexico: "placed",
      "South Africa": "placed",
      Switzerland: "placed",
      Canada: "placed",
      "Bosnia and Herzegovina": "qualified",
      France: "qualified",
      Norway: "qualified"
    });
  });

  it("extracts best-eight third-place teams from the qualified teams table", () => {
    const statuses = parseQualifiedTeams(
      doc(`
        <h2>Qualified teams</h2>
        <table class="wikitable">
          <tbody>
            <tr>
              <th>Group</th>
              <th>Winners</th>
              <th>Runners-up</th>
              <th>Best eightthird&#8209;placed teams</th>
              <th>Qualified<br>(position TBD)</th>
            </tr>
            <tr>
              <th>B</th>
              <td>Switzerland</td>
              <td>Canada</td>
              <td>Bosnia and Herzegovina</td>
              <td></td>
            </tr>
            <tr>
              <th>D</th>
              <td>United States</td>
              <td>Australia</td>
              <td>Paraguay</td>
              <td></td>
            </tr>
            <tr>
              <th>E</th>
              <td>Germany</td>
              <td>Ivory Coast</td>
              <td>Ecuador</td>
              <td></td>
            </tr>
            <tr>
              <th>F</th>
              <td>Netherlands</td>
              <td>Japan</td>
              <td><a href="/wiki/Sweden_national_football_team">Sweden</a></td>
              <td></td>
            </tr>
            <tr>
              <th>I</th>
              <td>France</td>
              <td>Norway</td>
              <td>Senegal</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      `)
    );

    expect(statuses).toEqual({
      Switzerland: "placed",
      Canada: "placed",
      "Bosnia and Herzegovina": "qualified",
      "United States": "placed",
      Australia: "placed",
      Paraguay: "qualified",
      Germany: "placed",
      "Ivory Coast": "placed",
      Ecuador: "qualified",
      Netherlands: "placed",
      Japan: "placed",
      Sweden: "qualified",
      France: "placed",
      Norway: "placed",
      Senegal: "qualified"
    });
    expect(statuses.Uruguay).toBeUndefined();
  });

  it("extracts third-place combinations", () => {
    const combinations = parseThirdPlaceCombinations(
      doc(`
        <h3>Combinations of matches in the round of 32</h3>
        <table class="wikitable">
          <tbody>
            <tr><td>1</td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td><td>3C</td><td>3B</td><td>3D</td><td>3E</td><td>3A</td><td>3F</td><td>3G</td><td>3H</td></tr>
          </tbody>
        </table>
      `)
    );

    expect(combinations[0].key).toBe("ABCDEFGH");
    expect(combinations[0].slotAssignments["1A"]).toBe("3C");
  });

  it("returns all round-of-32 matches when fixture headings are present", () => {
    const matches = parseRoundOf32(
      doc(`
        <h2>Round of 32</h2>
        <h3>Runner-up Group A vs Runner-up Group B</h3>
        <p>June 28, 2026</p>
        <p>12:00 p.m. UTC-7</p>
        <p>Runner-up Group A Match 73 Runner-up Group B</p>
        <p>SoFi Stadium, Inglewood</p>
      `)
    );

    expect(matches).toHaveLength(16);
    expect(matches[0]).toMatchObject({
      matchNumber: 73,
      homeSlot: "Runner-up Group A",
      time: "12:00 p.m. UTC-7",
      kickoffAt: "2026-06-28T19:00:00.000Z"
    });
  });

  it("parses kickoff instants from ASCII and Unicode UTC offsets", () => {
    expect(parseKickoffAt("June 18, 2026", "12:00 p.m. UTC-4")).toBe("2026-06-18T16:00:00.000Z");
    expect(parseKickoffAt("June 18, 2026", "12:00 p.m. UTC−4")).toBe("2026-06-18T16:00:00.000Z");
  });

  it("merges knockout metadata into later rounds by match number", () => {
    const matches = parseLaterRounds(
      doc(`
        <h2>Quarter-finals</h2>
        <h3>Winner Match 91 vs Winner Match 92</h3>
        <p>July 4, 2026</p>
        <p>3:00 p.m. UTC−4</p>
        <p>Winner Match 91 Match 99 Winner Match 92</p>
        <p>MetLife Stadium, East Rutherford</p>
      `)
    );
    const match99 = matches.find((match) => match.matchNumber === 99);

    expect(match99).toMatchObject({
      date: "July 4, 2026",
      time: "3:00 p.m. UTC−4",
      kickoffAt: "2026-07-04T19:00:00.000Z",
      venue: "MetLife Stadium, East Rutherford"
    });
  });

  it("builds the expected round-of-16 feeder mapping", () => {
    const roundOf16 = parseLaterRounds(doc(""))
      .filter((match) => match.round === "Round of 16")
      .map((match) => [match.matchNumber, match.homeSlot, match.awaySlot]);

    expect(roundOf16).toEqual([
      [89, "Winner Match 74", "Winner Match 77"],
      [90, "Winner Match 73", "Winner Match 75"],
      [91, "Winner Match 76", "Winner Match 78"],
      [92, "Winner Match 79", "Winner Match 80"],
      [93, "Winner Match 83", "Winner Match 84"],
      [94, "Winner Match 81", "Winner Match 82"],
      [95, "Winner Match 86", "Winner Match 88"],
      [96, "Winner Match 85", "Winner Match 87"]
    ]);
  });

  it("extracts knockout metadata from structured football boxes", () => {
    const matches = parseRoundOf32(
      doc(`
        <h2>Round of 32</h2>
        <h3>Winner Group E against best third place</h3>
        <div class="footballbox">
          <div class="fleft">
            <span class="fdate">June 29, 2026</span>
            <span class="ftime">12:00 p.m. UTC−5</span>
          </div>
          <table class="fevent">
            <tr><td class="fhome">Winner Group E</td><td class="fscore">Match 74</td><td class="faway">3rd Group A/B/C/D/F</td></tr>
          </table>
          <div class="fright"><span class="flocation">NRG Stadium, Houston</span></div>
        </div>
      `)
    );
    const match74 = matches.find((match) => match.matchNumber === 74);

    expect(match74).toMatchObject({
      date: "June 29, 2026",
      time: "12:00 p.m. UTC−5",
      kickoffAt: "2026-06-29T17:00:00.000Z",
      venue: "NRG Stadium, Houston"
    });
  });

  it("extracts final and third-place metadata from football boxes", () => {
    const matches = parseLaterRounds(
      doc(`
        <h2>Final</h2>
        <div class="footballbox">
          <span class="fdate">July 19, 2026</span>
          <span class="ftime">12:00 p.m. UTC−4</span>
          <table class="fevent">
            <tr><td class="fhome">Winner Match 101</td><td class="fscore">Match 104</td><td class="faway">Winner Match 102</td></tr>
          </table>
          <span class="flocation">MetLife Stadium, East Rutherford</span>
        </div>
        <h2>Third place</h2>
        <div class="footballbox">
          <span class="fdate">July 18, 2026</span>
          <span class="ftime">5:00 p.m. UTC−5</span>
          <table class="fevent">
            <tr><td class="fhome">Loser Match 101</td><td class="fscore">Match 103</td><td class="faway">Loser Match 102</td></tr>
          </table>
          <span class="flocation">Hard Rock Stadium, Miami Gardens</span>
        </div>
      `)
    );

    expect(matches.find((match) => match.matchNumber === 104)).toMatchObject({
      kickoffAt: "2026-07-19T16:00:00.000Z",
      venue: "MetLife Stadium, East Rutherford"
    });
    expect(matches.find((match) => match.matchNumber === 103)).toMatchObject({
      kickoffAt: "2026-07-18T22:00:00.000Z",
      venue: "Hard Rock Stadium, Miami Gardens"
    });
  });
});
