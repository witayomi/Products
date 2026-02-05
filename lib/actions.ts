"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import prisma from "./prisma";
import { getCurrentUser } from "./auth";
import { checkRateLimit } from "./rateLimit";
import {
  generateBlueprint,
  generateOpportunityBoard,
  generateValidationPlan,
  refineSection
} from "./ai/service";
import { rankIdeas } from "./ai/ranking";
import { createMarkdownExport, createPdfExport } from "./export";

export async function createProject(data: {
  name: string;
  niche: string;
  market: string;
  goal: string;
  intake: {
    niche: string;
    audience: string;
    expertise: string;
    timeAvailable: string;
    preferredFormat?: string;
    budgetConstraints: string;
    revenueGoal?: string;
    market: string;
    existingAssets: string;
  };
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: data.name,
      niche: data.niche,
      market: data.market,
      goal: data.goal,
      intake: {
        create: data.intake
      }
    }
  });

  revalidatePath("/dashboard");
  return project;
}

export async function generateOpportunities(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const limit = checkRateLimit(`opportunities:${user.id}`);
  if (!limit.allowed) throw new Error("Rate limit exceeded");

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { intake: true }
  });
  if (!project || !project.intake) throw new Error("Project not found");

  const result = await generateOpportunityBoard(
    {
      intake: project.intake
    },
    {
      ideas: [
        {
          title: "Template Pack for Ops KPI Reviews",
          summary: "A set of KPI dashboard templates and review scripts for ops leaders.",
          scoreDemand: 7,
          scoreCompetition: 5,
          scoreDifferentiation: 6,
          scoreComplexity: 3,
          recommendedFormat: "Template pack",
          priceBand: "$59-$129",
          targetBuyer: "Ops managers with limited analytics support",
          corePain: "Inconsistent KPI reporting",
          promiseAngle: "Standardize KPI reviews in 14 days",
          whyItSells: "Quick win templates",
          differentiationWedge: "Industry-specific KPI library"
        },
        {
          title: "KPI Storytelling Workshop",
          summary: "Live workshop helping ops leaders communicate KPI insights clearly.",
          scoreDemand: 6,
          scoreCompetition: 4,
          scoreDifferentiation: 7,
          scoreComplexity: 4,
          recommendedFormat: "Workshop",
          priceBand: "$149-$299",
          targetBuyer: "Ops leads presenting to executives",
          corePain: "Metrics fail to drive decisions",
          promiseAngle: "Turn dashboards into decision narratives",
          whyItSells: "Immediate presentation wins",
          differentiationWedge: "Ops-specific narrative templates"
        },
        {
          title: "Ops Analytics Cohort",
          summary: "Cohort program to build a full KPI stack with coaching.",
          scoreDemand: 8,
          scoreCompetition: 6,
          scoreDifferentiation: 6,
          scoreComplexity: 6,
          recommendedFormat: "Cohort course",
          priceBand: "$499-$899",
          targetBuyer: "Ops managers launching analytics initiatives",
          corePain: "No end-to-end analytics plan",
          promiseAngle: "Ship a KPI system with accountability",
          whyItSells: "Group momentum and coaching",
          differentiationWedge: "Implementation sprints"
        },
        {
          title: "Ops KPI Audit Mini-Product",
          summary: "Short product that audits existing KPIs and gaps.",
          scoreDemand: 6,
          scoreCompetition: 5,
          scoreDifferentiation: 5,
          scoreComplexity: 3,
          recommendedFormat: "Micro-product",
          priceBand: "$79-$149",
          targetBuyer: "Teams unsure their KPIs align to goals",
          corePain: "Misaligned KPI definitions",
          promiseAngle: "Clarify KPI gaps in a week",
          whyItSells: "Low-cost quick clarity",
          differentiationWedge: "KPI alignment checklist"
        },
        {
          title: "Dashboard Build Sprint",
          summary: "Guided sprint to deliver a working KPI dashboard quickly.",
          scoreDemand: 7,
          scoreCompetition: 5,
          scoreDifferentiation: 6,
          scoreComplexity: 5,
          recommendedFormat: "Cohort sprint",
          priceBand: "$299-$599",
          targetBuyer: "Ops teams with stalled dashboard projects",
          corePain: "Dashboard projects stuck in backlog",
          promiseAngle: "Deliver a usable dashboard in 2 weeks",
          whyItSells: "Time-bound delivery",
          differentiationWedge: "Live build sessions"
        }
      ]
    }
  );

  const ranked = rankIdeas(result.ideas);
  await prisma.idea.deleteMany({ where: { projectId } });
  await prisma.idea.createMany({
    data: ranked.map((idea) => ({
      projectId,
      ...idea
    }))
  });

  revalidatePath(`/projects/${projectId}/opportunities`);
}

export async function selectIdea(projectId: string, ideaId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.idea.updateMany({
    where: { projectId },
    data: { selected: false }
  });

  await prisma.idea.update({
    where: { id: ideaId },
    data: { selected: true }
  });

  await prisma.validation.upsert({
    where: { projectId },
    update: { selectedIdeaId: ideaId },
    create: {
      projectId,
      selectedIdeaId: ideaId,
      interviewQuestions: [],
      experiments: [],
      successMetrics: [],
      status: "not_started"
    }
  });

  await prisma.blueprint.upsert({
    where: { projectId },
    update: { selectedIdeaId: ideaId },
    create: {
      projectId,
      selectedIdeaId: ideaId,
      icp: "",
      positioning: "",
      outcomes: [],
      curriculum: [],
      productionPlan: [],
      pricingStrategy: "",
      proofPlan: [],
      risks: []
    }
  });

  revalidatePath(`/projects/${projectId}/opportunities`);
  revalidatePath(`/projects/${projectId}/validation`);
  revalidatePath(`/projects/${projectId}/blueprint`);
}

export async function generateValidation(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const limit = checkRateLimit(`validation:${user.id}`);
  if (!limit.allowed) throw new Error("Rate limit exceeded");

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { intake: true, ideas: true }
  });
  if (!project || !project.intake) throw new Error("Project not found");

  const selectedIdea = project.ideas.find((idea) => idea.selected);
  if (!selectedIdea) throw new Error("Select an idea first");

  const result = await generateValidationPlan(
    {
      selectedIdea,
      intake: project.intake
    },
    {
      interviewQuestions: [
        "What is your biggest reporting pain today?",
        "How do you currently validate KPI accuracy?",
        "What would make a dashboard feel trustworthy?",
        "How often do you share KPI updates?",
        "What tools are you using now?",
        "What is missing from those tools?",
        "What would success look like in 30 days?",
        "What is your budget for training?",
        "Who else needs to approve this?",
        "What stops you from acting today?"
      ],
      experiments: [
        { type: "waitlist", description: "Launch a simple waitlist page" },
        { type: "consultation offer", description: "Offer 5 discovery calls" },
        { type: "mini product", description: "Sell a KPI dashboard template" }
      ],
      successMetrics: ["10 qualified waitlist signups", "3 paid pre-sells"]
    }
  );

  await prisma.validation.upsert({
    where: { projectId },
    update: {
      selectedIdeaId: selectedIdea.id,
      interviewQuestions: result.interviewQuestions,
      experiments: result.experiments,
      successMetrics: result.successMetrics,
      status: "in_progress"
    },
    create: {
      projectId,
      selectedIdeaId: selectedIdea.id,
      interviewQuestions: result.interviewQuestions,
      experiments: result.experiments,
      successMetrics: result.successMetrics,
      status: "in_progress"
    }
  });

  revalidatePath(`/projects/${projectId}/validation`);
}

export async function updateValidationNotes(projectId: string, notes: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.validation.update({
    where: { projectId },
    data: { notes }
  });

  revalidatePath(`/projects/${projectId}/validation`);
}

export async function generateBlueprintForProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const limit = checkRateLimit(`blueprint:${user.id}`);
  if (!limit.allowed) throw new Error("Rate limit exceeded");

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { intake: true, ideas: true, validation: true }
  });
  if (!project || !project.intake) throw new Error("Project not found");

  const selectedIdea = project.ideas.find((idea) => idea.selected);
  if (!selectedIdea) throw new Error("Select an idea first");

  const result = await generateBlueprint(
    {
      selectedIdea,
      intake: project.intake,
      validationNotes: project.validation?.notes ?? ""
    },
    {
      icp: "Ops managers who own KPI reporting",
      positioning: "A cohort that helps ops teams ship KPI dashboards",
      outcomes: ["KPI dashboard", "Reporting workflow"],
      curriculum: [
        { module: "Week 1", lessons: ["KPI selection", "Data mapping"] },
        { module: "Week 2", lessons: ["Dashboard build", "Review cadence"] }
      ],
      productionPlan: [
        { phase: "MVP", steps: ["2 live sessions", "template pack"] },
        { phase: "v1", steps: ["Office hours", "case study library"] },
        { phase: "v2", steps: ["Automations", "certification"] }
      ],
      pricingStrategy: "Tiered pricing with an early-bird discount; no guarantees.",
      proofPlan: ["Collect before/after KPI screenshots", "Record student testimonials"],
      risks: ["Low data access", "Stakeholder alignment gaps"]
    }
  );

  await prisma.blueprint.upsert({
    where: { projectId },
    update: {
      selectedIdeaId: selectedIdea.id,
      ...result
    },
    create: {
      projectId,
      selectedIdeaId: selectedIdea.id,
      ...result
    }
  });

  revalidatePath(`/projects/${projectId}/blueprint`);
}

export async function refineBlueprintSection(projectId: string, section: string, currentText: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const limit = checkRateLimit(`refine:${user.id}`);
  if (!limit.allowed) throw new Error("Rate limit exceeded");

  const result = await refineSection({ section, currentText }, { text: currentText });
  const jsonFields = new Set(["outcomes", "curriculum", "productionPlan", "proofPlan", "risks"]);

  if (jsonFields.has(section)) {
    try {
      const parsed = JSON.parse(result.text);
      await prisma.blueprint.update({
        where: { projectId },
        data: { [section]: parsed }
      });
    } catch (error) {
      return;
    }
  } else {
    const data: Record<string, string> = {};
    data[section] = result.text;

    await prisma.blueprint.update({
      where: { projectId },
      data
    });
  }

  revalidatePath(`/projects/${projectId}/blueprint`);
}

export async function updateBlueprintField(projectId: string, field: string, value: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const data: Record<string, string> = {};
  data[field] = value;

  await prisma.blueprint.update({
    where: { projectId },
    data
  });

  revalidatePath(`/projects/${projectId}/blueprint`);
}

export async function updateBlueprintJson(projectId: string, field: string, value: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    return;
  }

  const data: Record<string, unknown> = {};
  data[field] = parsed;

  await prisma.blueprint.update({
    where: { projectId },
    data
  });

  revalidatePath(`/projects/${projectId}/blueprint`);
}

export async function createShareLink(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const token = nanoid(16);
  const shareLink = await prisma.shareLink.upsert({
    where: { projectId },
    update: { token },
    create: { projectId, token }
  });

  revalidatePath(`/projects/${projectId}/export`);
  return shareLink;
}

export async function exportMarkdown(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) throw new Error("Project not found");
  await createMarkdownExport(projectId);
  revalidatePath(`/projects/${projectId}/export`);
}

export async function exportPdf(projectId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) throw new Error("Project not found");
  await createPdfExport(projectId);
  revalidatePath(`/projects/${projectId}/export`);
}

export async function logout() {
  const user = await getCurrentUser();
  if (!user) return;
  const { destroySession } = await import("./auth");
  await destroySession();
}
