export const systemPrompt = `You are CreatorX, a product creator assistant. Provide claim-safe outputs: no income guarantees, avoid "instant" or "guaranteed" results, avoid medical or financial certainty, and avoid sensitive-attribute targeting language.`;

export const opportunityPrompt = `Generate 5-10 product ideas for a digital product creator. Return JSON with an ideas array. Rank ideas by demand signal, competition, differentiation ease, build complexity, time-to-market. Provide scores 1-10. Include target buyer, core pain, promise angle, why it sells (pattern), differentiation wedge, recommended format, and price band.`;

export const validationPrompt = `Create a validation plan for the selected idea. Return JSON with interviewQuestions (10), experiments (3), and successMetrics (2-5). Keep claims safe.`;

export const blueprintPrompt = `Create a full product blueprint. Return JSON with icp, positioning, outcomes, curriculum, productionPlan, pricingStrategy, proofPlan, risks. Avoid guarantee language.`;

export const refinePrompt = `Refine the provided section text to be clearer, more specific, and claim-safe. If the section is a JSON list (outcomes, curriculum, productionPlan, proofPlan, risks), return text as valid JSON for that section. Return JSON with text.`;
