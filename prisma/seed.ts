import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@creatorx.app" },
    update: {},
    create: {
      email: "demo@creatorx.app",
      passwordHash
    }
  });

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: "Ops Analytics Course",
      niche: "Data analytics for operations managers",
      market: "US",
      goal: "Launch a validated cohort course",
      intake: {
        create: {
          niche: "Operations analytics",
          audience: "Operations managers at mid-size SaaS",
          expertise: "10 years in ops analytics and BI implementation",
          timeAvailable: "6 hours/week",
          preferredFormat: "Cohort course",
          budgetConstraints: "$2k budget for tooling",
          revenueGoal: "Replace consulting income",
          market: "US",
          existingAssets: "Monthly newsletter with 1,500 subscribers"
        }
      }
    }
  });

  const idea = await prisma.idea.create({
    data: {
      projectId: project.id,
      title: "Ops KPI Dashboards in 30 Days",
      summary: "A cohort-based course to help ops leaders build actionable KPI dashboards quickly.",
      scoreDemand: 8,
      scoreCompetition: 5,
      scoreDifferentiation: 7,
      scoreComplexity: 4,
      recommendedFormat: "Cohort course",
      priceBand: "$499-$899",
      targetBuyer: "Operations managers lacking reliable KPI visibility",
      corePain: "Manual reporting and unclear performance signals",
      promiseAngle: "Ship a KPI dashboard that leadership trusts in 30 days",
      whyItSells: "Hands-on dashboards with accountability",
      differentiationWedge: "Templates + live reviews",
      selected: true
    }
  });

  await prisma.validation.create({
    data: {
      projectId: project.id,
      selectedIdeaId: idea.id,
      interviewQuestions: [
        "What reporting tasks consume the most time each week?",
        "Which KPI decisions feel risky today and why?"
      ],
      experiments: [
        { type: "waitlist", description: "Landing page with early access" }
      ],
      successMetrics: ["5 qualified waitlist signups", "2 paid discovery calls"],
      notes: "3 managers expressed interest in a KPI dashboard workshop.",
      status: "in_progress"
    }
  });

  await prisma.blueprint.create({
    data: {
      projectId: project.id,
      selectedIdeaId: idea.id,
      icp: "Ops managers at 50-500 employee SaaS firms who own weekly reporting.",
      positioning: "A cohort that helps ops leaders ship KPI dashboards with coaching and templates.",
      outcomes: ["A KPI dashboard template", "Weekly reporting workflow"],
      curriculum: [
        { module: "Week 1", lessons: ["KPI alignment", "Data sources"] },
        { module: "Week 2", lessons: ["Dashboard build", "Stakeholder review"] }
      ],
      productionPlan: [
        { phase: "MVP", steps: ["2 live sessions", "template pack"] },
        { phase: "v1", steps: ["Add office hours", "case study library"] }
      ],
      pricingStrategy: "Offer a single cohort price with a risk reversal: cancel after week 1.",
      proofPlan: ["Collect before/after dashboard screenshots", "Capture time saved quotes"],
      risks: ["Limited data access", "Stakeholder alignment delays"]
    }
  });

  await prisma.export.create({
    data: {
      projectId: project.id,
      type: "markdown",
      url: "/exports/demo-blueprint.md"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
