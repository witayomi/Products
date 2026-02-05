import { describe, expect, it } from "vitest";
import { rankIdeas } from "@/lib/ai/ranking";

const ideas = [
  {
    title: "Low score",
    summary: "",
    scoreDemand: 3,
    scoreCompetition: 7,
    scoreDifferentiation: 2,
    scoreComplexity: 6,
    recommendedFormat: "Course",
    priceBand: "$199",
    targetBuyer: "",
    corePain: "",
    promiseAngle: "",
    whyItSells: "",
    differentiationWedge: ""
  },
  {
    title: "High score",
    summary: "",
    scoreDemand: 8,
    scoreCompetition: 3,
    scoreDifferentiation: 7,
    scoreComplexity: 2,
    recommendedFormat: "Course",
    priceBand: "$199",
    targetBuyer: "",
    corePain: "",
    promiseAngle: "",
    whyItSells: "",
    differentiationWedge: ""
  }
];

describe("rankIdeas", () => {
  it("ranks by weighted score", () => {
    const ranked = rankIdeas(ideas);
    expect(ranked[0].title).toBe("High score");
  });
});
