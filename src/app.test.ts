import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { parseGroupStandings } from "./parse";
import { resolveThirdPlaceRanking } from "./app";

function doc(html: string): Document {
  return new JSDOM(html).window.document;
}

const groupsOnlyHtml = `
  ${["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
    .map(
      (group, index) => `
      <h3>Group ${group}</h3>
      <table class="wikitable">
        <tbody>
          <tr><th>Pos</th><th>Team</th><th>Pld</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
          <tr><td>1</td><td>${group} Winner</td><td>3</td><td>2</td><td>1</td><td>0</td><td>5</td><td>1</td><td>+4</td><td>7</td></tr>
          <tr><td>2</td><td>${group} Runner</td><td>3</td><td>1</td><td>2</td><td>0</td><td>4</td><td>2</td><td>+2</td><td>5</td></tr>
          <tr><td>3</td><td>${group} Third</td><td>3</td><td>1</td><td>0</td><td>2</td><td>${12 - index}</td><td>4</td><td>${8 - index}</td><td>3</td></tr>
          <tr><td>4</td><td>${group} Fourth</td><td>3</td><td>0</td><td>1</td><td>2</td><td>1</td><td>6</td><td>-5</td><td>1</td></tr>
        </tbody>
      </table>
    `
    )
    .join("")}
`;

describe("app data loading helpers", () => {
  it("falls back to standings-derived third-place ranking when the source table is missing", () => {
    const document = doc(groupsOnlyHtml);
    const groups = parseGroupStandings(document);
    const ranking = resolveThirdPlaceRanking(document, groups);

    expect(ranking).toHaveLength(12);
    expect(ranking[0]).toMatchObject({ group: "A", team: "A Third", qualified: true });
    expect(ranking[7]).toMatchObject({ group: "H", qualified: true });
    expect(ranking[8]).toMatchObject({ group: "I", qualified: false });
  });
});
