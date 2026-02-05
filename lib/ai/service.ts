import OpenAI from "openai";
import { z } from "zod";
import {
  blueprintSchema,
  opportunityBoardSchema,
  refineSchema,
  validationPlanSchema
} from "./schemas";
import {
  blueprintPrompt,
  opportunityPrompt,
  refinePrompt,
  systemPrompt,
  validationPrompt
} from "./prompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function callJson<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  input: object,
  fallback: T,
  retries = 2
) {
  if (!process.env.OPENAI_API_KEY) {
    return schema.parse(fallback);
  }

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${prompt}\n\nContext:\n${JSON.stringify(input)}` }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(content);
      return schema.parse(parsed);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
    }
  }

  return schema.parse(fallback);
}

export async function generateOpportunityBoard(intake: object, fallback?: unknown) {
  return callJson(
    opportunityPrompt,
    opportunityBoardSchema,
    intake,
    opportunityBoardSchema.parse(fallback ?? { ideas: [] })
  );
}

export async function generateValidationPlan(input: object, fallback?: unknown) {
  return callJson(
    validationPrompt,
    validationPlanSchema,
    input,
    validationPlanSchema.parse(
      fallback ?? { interviewQuestions: [], experiments: [], successMetrics: [] }
    )
  );
}

export async function generateBlueprint(input: object, fallback?: unknown) {
  return callJson(
    blueprintPrompt,
    blueprintSchema,
    input,
    blueprintSchema.parse(
      fallback ?? {
        icp: "",
        positioning: "",
        outcomes: [],
        curriculum: [],
        productionPlan: [],
        pricingStrategy: "",
        proofPlan: [],
        risks: []
      }
    )
  );
}

export async function refineSection(input: object, fallback?: unknown) {
  return callJson(refinePrompt, refineSchema, input, refineSchema.parse(fallback ?? { text: "" }));
}
