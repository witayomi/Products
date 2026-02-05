import { z } from "zod";

export const opportunityIdeaSchema = z.object({
  title: z.string(),
  summary: z.string(),
  scoreDemand: z.number().int().min(1).max(10),
  scoreCompetition: z.number().int().min(1).max(10),
  scoreDifferentiation: z.number().int().min(1).max(10),
  scoreComplexity: z.number().int().min(1).max(10),
  recommendedFormat: z.string(),
  priceBand: z.string(),
  targetBuyer: z.string(),
  corePain: z.string(),
  promiseAngle: z.string(),
  whyItSells: z.string(),
  differentiationWedge: z.string()
});

export const opportunityBoardSchema = z.object({
  ideas: z.array(opportunityIdeaSchema).min(5).max(10)
});

export const validationPlanSchema = z.object({
  interviewQuestions: z.array(z.string()).min(8).max(12),
  experiments: z.array(
    z.object({
      type: z.string(),
      description: z.string()
    })
  ).min(3).max(4),
  successMetrics: z.array(z.string()).min(2).max(5)
});

export const blueprintSchema = z.object({
  icp: z.string(),
  positioning: z.string(),
  outcomes: z.array(z.string()),
  curriculum: z.array(
    z.object({
      module: z.string(),
      lessons: z.array(z.string())
    })
  ),
  productionPlan: z.array(
    z.object({
      phase: z.string(),
      steps: z.array(z.string())
    })
  ),
  pricingStrategy: z.string(),
  proofPlan: z.array(z.string()),
  risks: z.array(z.string())
});

export const refineSchema = z.object({
  text: z.string()
});
