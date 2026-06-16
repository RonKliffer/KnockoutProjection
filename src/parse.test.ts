import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import {
  parseGroupStandings,
  parseRoundOf32,
  parseThirdPlaceCombinations,
  parseThirdPlaceRanking
} from "./parse";

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

  it("extracts third-place ranking", () => {
    const ranking = parseThirdPlaceRanking(doc(groupsHtml));
    expect(ranking).toHaveLength(12);
    expect(ranking[0]).toMatchObject({ group: "A", qualified: true });
    expect(ranking[8]).toMatchObject({ group: "I", qualified: false });
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
    expect(matches[0]).toMatchObject({ matchNumber: 73, homeSlot: "Runner-up Group A" });
  });
});
