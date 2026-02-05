import { describe, expect, it } from "vitest";
import { opportunityBoardSchema, validationPlanSchema } from "@/lib/ai/schemas";

describe("AI JSON schemas", () => {
  it("validates opportunity board", () => {
    const result = opportunityBoardSchema.parse({
      ideas: [
        {
          title: "Idea 1",
          summary: "Summary",
          scoreDemand: 7,
          scoreCompetition: 4,
          scoreDifferentiation: 6,
          scoreComplexity: 3,
          recommendedFormat: "Course",
          priceBand: "$199-$399",
          targetBuyer: "Ops managers",
          corePain: "Manual reporting",
          promiseAngle: "Reduce manual reporting",
          whyItSells: "High time savings",
          differentiationWedge: "Templates"
        },
        {
          title: "Idea 2",
          summary: "Summary",
          scoreDemand: 6,
          scoreCompetition: 5,
          scoreDifferentiation: 6,
          scoreComplexity: 4,
          recommendedFormat: "Workshop",
          priceBand: "$99-$199",
          targetBuyer: "Analysts",
          corePain: "Lack of direction",
          promiseAngle: "Build clarity",
          whyItSells: "Quick wins",
          differentiationWedge: "Coaching"
        },
        {
          title: "Idea 3",
          summary: "Summary",
          scoreDemand: 5,
          scoreCompetition: 6,
          scoreDifferentiation: 4,
          scoreComplexity: 2,
          recommendedFormat: "Template pack",
          priceBand: "$49-$99",
          targetBuyer: "Ops leads",
          corePain: "Inconsistent KPIs",
          promiseAngle: "Standardize KPIs",
          whyItSells: "Reusable assets",
          differentiationWedge: "Industry focus"
        },
        {
          title: "Idea 4",
          summary: "Summary",
          scoreDemand: 8,
          scoreCompetition: 5,
          scoreDifferentiation: 7,
          scoreComplexity: 5,
          recommendedFormat: "Cohort",
          priceBand: "$599-$999",
          targetBuyer: "Ops leaders",
          corePain: "Slow adoption",
          promiseAngle: "Accelerate adoption",
          whyItSells: "Community",
          differentiationWedge: "Live reviews"
        },
        {
          title: "Idea 5",
          summary: "Summary",
          scoreDemand: 7,
          scoreCompetition: 4,
          scoreDifferentiation: 7,
          scoreComplexity: 4,
          recommendedFormat: "Mini-course",
          priceBand: "$129-$199",
          targetBuyer: "Managers",
          corePain: "Data overwhelm",
          promiseAngle: "Simplify data",
          whyItSells: "Short format",
          differentiationWedge: "Checklists"
        }
      ]
    });

    expect(result.ideas).toHaveLength(5);
  });

  it("validates validation plan", () => {
    const result = validationPlanSchema.parse({
      interviewQuestions: Array.from({ length: 10 }, (_, idx) => `Question ${idx + 1}`),
      experiments: [
        { type: "waitlist", description: "Landing page" },
        { type: "pre-sell", description: "Offer to early adopters" },
        { type: "consultation", description: "Discovery calls" }
      ],
      successMetrics: ["10 signups", "3 paid customers"]
    });

    expect(result.experiments).toHaveLength(3);
  });
});
