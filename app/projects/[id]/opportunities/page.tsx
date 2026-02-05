import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateOpportunities, selectIdea } from "@/lib/actions";

async function generateAction(projectId: string) {
  "use server";
  await generateOpportunities(projectId);
}

async function selectAction(projectId: string, ideaId: string) {
  "use server";
  await selectIdea(projectId, ideaId);
}

export default async function OpportunitiesPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  const ideas = await prisma.idea.findMany({
    where: { projectId: params.id, project: { userId: user.id } },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="section-title">Opportunity Board</h2>
          <p className="text-sm text-slate-600">
            Generate market-informed product ideas ranked by demand and differentiation.
          </p>
          <p className="mt-2 text-xs text-slate-500">Regenerating will overwrite the current ideas.</p>
        </div>
        <form action={generateAction.bind(null, params.id)}>
          <button className="button" type="submit">Generate ideas</button>
        </form>
      </div>

      {ideas.length === 0 ? (
        <div className="card">
          <p className="text-sm text-slate-600">No ideas yet. Generate your first board.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{idea.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{idea.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="badge">Demand {idea.scoreDemand}/10</span>
                    <span className="badge">Competition {idea.scoreCompetition}/10</span>
                    <span className="badge">Differentiation {idea.scoreDifferentiation}/10</span>
                    <span className="badge">Complexity {idea.scoreComplexity}/10</span>
                    <span className="badge">{idea.recommendedFormat}</span>
                    <span className="badge">{idea.priceBand}</span>
                  </div>
                </div>
                <form action={selectAction.bind(null, params.id, idea.id)}>
                  <button className={idea.selected ? "button-secondary" : "button"} type="submit">
                    {idea.selected ? "Selected" : "Select"}
                  </button>
                </form>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                <div><span className="font-medium">Target buyer:</span> {idea.targetBuyer}</div>
                <div><span className="font-medium">Core pain:</span> {idea.corePain}</div>
                <div><span className="font-medium">Promise angle:</span> {idea.promiseAngle}</div>
                <div><span className="font-medium">Why it sells:</span> {idea.whyItSells}</div>
                <div><span className="font-medium">Differentiation wedge:</span> {idea.differentiationWedge}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
