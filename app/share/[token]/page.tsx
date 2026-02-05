import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function SharePage({ params }: { params: { token: string } }) {
  const link = await prisma.shareLink.findUnique({
    where: { token: params.token },
    include: { project: { include: { blueprint: true, ideas: true } } }
  });

  if (!link || !link.project.blueprint) {
    notFound();
  }

  const blueprint = link.project.blueprint;
  const selectedIdea = link.project.ideas.find((idea) => idea.selected);

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <div className="card">
        <h1 className="text-2xl font-semibold text-slate-900">{link.project.name}</h1>
        <p className="text-sm text-slate-600">Shared blueprint</p>
        <div className="mt-6 space-y-4 text-sm text-slate-700">
          <p><span className="font-medium">Selected idea:</span> {selectedIdea?.title ?? "Not selected"}</p>
          <p><span className="font-medium">ICP:</span> {blueprint.icp}</p>
          <p><span className="font-medium">Positioning:</span> {blueprint.positioning}</p>
          <p><span className="font-medium">Pricing strategy:</span> {blueprint.pricingStrategy}</p>
          <div>
            <p className="font-medium">Outcomes</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs">
              {JSON.stringify(blueprint.outcomes, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-medium">Curriculum</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs">
              {JSON.stringify(blueprint.curriculum, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-medium">Production plan</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs">
              {JSON.stringify(blueprint.productionPlan, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-medium">Proof plan</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs">
              {JSON.stringify(blueprint.proofPlan, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-medium">Risks</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs">
              {JSON.stringify(blueprint.risks, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
