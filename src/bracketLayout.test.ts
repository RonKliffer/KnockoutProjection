import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { buildBracketLayout } from "./bracketLayout";
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
