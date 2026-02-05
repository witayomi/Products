import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { Document, Page, StyleSheet, Text } from "@react-pdf/renderer";
import { renderToBuffer } from "@react-pdf/renderer";
import prisma from "./prisma";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, fontFamily: "Helvetica" },
  heading: { fontSize: 18, marginBottom: 8 },
  section: { marginBottom: 12 }
});

export async function createMarkdownExport(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { blueprint: true, ideas: true }
  });
  if (!project || !project.blueprint) throw new Error("Blueprint missing");

  const selectedIdea = project.ideas.find((idea) => idea.selected);
  const blueprint = project.blueprint;

  const content = `# ${project.name}\n\n## Selected Idea\n${selectedIdea?.title ?? "Not selected"}\n\n## ICP\n${blueprint.icp}\n\n## Positioning\n${blueprint.positioning}\n\n## Outcomes\n${JSON.stringify(blueprint.outcomes, null, 2)}\n\n## Curriculum\n${JSON.stringify(blueprint.curriculum, null, 2)}\n\n## Production Plan\n${JSON.stringify(blueprint.productionPlan, null, 2)}\n\n## Pricing Strategy\n${blueprint.pricingStrategy}\n\n## Proof Plan\n${JSON.stringify(blueprint.proofPlan, null, 2)}\n\n## Risks\n${JSON.stringify(blueprint.risks, null, 2)}\n`;

  const filename = `blueprint-${nanoid(8)}.md`;
  const filePath = path.join(process.cwd(), "public", "exports", filename);
  await fs.writeFile(filePath, content, "utf8");

  const exportRecord = await prisma.export.create({
    data: {
      projectId,
      type: "markdown",
      url: `/exports/${filename}`
    }
  });

  return exportRecord;
}

export async function createPdfExport(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { blueprint: true, ideas: true }
  });
  if (!project || !project.blueprint) throw new Error("Blueprint missing");
  const selectedIdea = project.ideas.find((idea) => idea.selected);
  const blueprint = project.blueprint;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>{project.name}</Text>
        <Text style={styles.section}>Selected idea: {selectedIdea?.title ?? "Not selected"}</Text>
        <Text style={styles.section}>ICP: {blueprint.icp}</Text>
        <Text style={styles.section}>Positioning: {blueprint.positioning}</Text>
        <Text style={styles.section}>Outcomes: {JSON.stringify(blueprint.outcomes)}</Text>
        <Text style={styles.section}>Curriculum: {JSON.stringify(blueprint.curriculum)}</Text>
        <Text style={styles.section}>Production plan: {JSON.stringify(blueprint.productionPlan)}</Text>
        <Text style={styles.section}>Pricing strategy: {blueprint.pricingStrategy}</Text>
        <Text style={styles.section}>Proof plan: {JSON.stringify(blueprint.proofPlan)}</Text>
        <Text style={styles.section}>Risks: {JSON.stringify(blueprint.risks)}</Text>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  const filename = `blueprint-${nanoid(8)}.pdf`;
  const filePath = path.join(process.cwd(), "public", "exports", filename);
  await fs.writeFile(filePath, buffer);

  const exportRecord = await prisma.export.create({
    data: {
      projectId,
      type: "pdf",
      url: `/exports/${filename}`
    }
  });

  return exportRecord;
}
