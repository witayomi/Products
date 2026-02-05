import { OpportunityIdea } from "./types";

export function rankIdeas(ideas: OpportunityIdea[]) {
  return [...ideas].sort((a, b) => {
    const scoreA = a.scoreDemand * 2 + a.scoreDifferentiation - a.scoreCompetition - a.scoreComplexity;
    const scoreB = b.scoreDemand * 2 + b.scoreDifferentiation - b.scoreCompetition - b.scoreComplexity;
    return scoreB - scoreA;
  });
}
