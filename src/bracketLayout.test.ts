import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { buildBracketLayout, buildConnectorPath } from "./bracketLayout";
import { buildLaterRounds, parseRoundOf32 } from "./parse";

describe("bracket layout", () => {
  it("orders bracket columns by feeder relationships", () => {
    const layout = buildBracketLayout(parseRoundOf32(doc()), buildLaterRounds());

    expect(matchNumbers(layout.leftRounds[0].matches)).toEqual([73, 75, 74, 77, 83, 84, 81, 82]);
    expect(matchNumbers(layout.leftRounds[1].matches)).toEqual([89, 90, 93, 94]);
    expect(matchNumbers(layout.leftRounds[2].matches)).toEqual([97, 98]);
    expect(matchNumbers(layout.leftRounds[3].matches)).toEqual([101]);

    expect(matchNumbers(layout.rightRounds[0].matches)).toEqual([102]);
    expect(matchNumbers(layout.rightRounds[1].matches)).toEqual([99, 100]);
    expect(matchNumbers(layout.rightRounds[2].matches)).toEqual([91, 92, 95, 96]);
    expect(matchNumbers(layout.rightRounds[3].matches)).toEqual([76, 78, 79, 80, 86, 88, 85, 87]);
    expect(matchNumbers(layout.finals)).toEqual([104, 103]);
  });

  it("pairs matches 87 and 88 with their actual round-of-16 opponents", () => {
    const layout = buildBracketLayout(parseRoundOf32(doc()), buildLaterRounds());
    const rightRoundOf32Pairs = pairs(matchNumbers(layout.rightRounds[3].matches));

    expect(rightRoundOf32Pairs).toContainEqual([86, 88]);
    expect(rightRoundOf32Pairs).toContainEqual([85, 87]);
    expect(rightRoundOf32Pairs).not.toContainEqual([87, 88]);
  });

  it("tracks connector relationships from winner slots", () => {
    const layout = buildBracketLayout(parseRoundOf32(doc()), buildLaterRounds());
    const connections = layout.connections.map((connection) => [
      connection.fromMatchNumber,
      connection.toMatchNumber
    ]);

    expect(connections).toContainEqual([91, 99]);
    expect(connections).toContainEqual([92, 99]);
    expect(connections).toContainEqual([86, 95]);
    expect(connections).toContainEqual([88, 95]);
    expect(connections).toContainEqual([85, 96]);
    expect(connections).toContainEqual([87, 96]);
    expect(connections).toContainEqual([101, 104]);
    expect(connections).toContainEqual([102, 104]);
    expect(connections).not.toContainEqual([101, 103]);
    expect(connections).not.toContainEqual([102, 103]);
  });

  it("builds deterministic connector paths between card edge centers", () => {
    expect(
      buildConnectorPath(
        { left: 10, top: 20, width: 100, height: 80 },
        { left: 210, top: 120, width: 100, height: 80 }
      )
    ).toBe("M 110 60 H 160 V 160 H 210");

    expect(
      buildConnectorPath(
        { left: 330, top: 120, width: 100, height: 80 },
        { left: 140, top: 20, width: 100, height: 80 }
      )
    ).toBe("M 330 160 H 285 V 60 H 240");
  });
});

function doc(): Document {
  return new JSDOM("").window.document;
}

function matchNumbers(matches: { matchNumber: number }[]): number[] {
  return matches.map((match) => match.matchNumber);
}

function pairs(numbers: number[]): number[][] {
  const result: number[][] = [];
  for (let index = 0; index < numbers.length; index += 2) {
    result.push(numbers.slice(index, index + 2));
  }
  return result;
}
