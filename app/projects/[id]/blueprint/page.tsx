import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  generateBlueprintForProject,
  refineBlueprintSection,
  updateBlueprintField,
  updateBlueprintJson
} from "@/lib/actions";
import AutoSaveForm from "@/components/AutoSaveForm";

async function generateAction(projectId: string) {
  "use server";
  await generateBlueprintForProject(projectId);
}

async function refineAction(projectId: string, section: string, formData: FormData) {
  "use server";
  const currentText = String(formData.get("currentText") ?? "");
  await refineBlueprintSection(projectId, section, currentText);
}

async function updateTextAction(projectId: string, field: string, formData: FormData) {
  "use server";
  const value = String(formData.get("value") ?? "");
  await updateBlueprintField(projectId, field, value);
}

async function updateJsonAction(projectId: string, field: string, formData: FormData) {
  "use server";
  const value = String(formData.get("value") ?? "[]");
  await updateBlueprintJson(projectId, field, value);
}

export default async function BlueprintPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const blueprint = await prisma.blueprint.findFirst({
    where: { projectId: params.id, project: { userId: user.id } }
  });

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="section-title">Product Blueprint</h2>
          <p className="text-sm text-slate-600">Generate and refine your full build plan.</p>
          <p className="mt-2 text-xs text-slate-500">Regenerating will overwrite the current blueprint.</p>
        </div>
        <form action={generateAction.bind(null, params.id)}>
          <button className="button" type="submit">Generate blueprint</button>
        </form>
      </div>

      {!blueprint ? (
        <div className="card">
          <p className="text-sm text-slate-600">Select an idea to generate the blueprint.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="card">
            <div className="flex items-start justify-between">
              <h3 className="section-title">ICP</h3>
              <form action={refineAction.bind(null, params.id, "icp")}> 
                <input type="hidden" name="currentText" value={blueprint.icp} />
                <button className="button-secondary" type="submit">Refine</button>
              </form>
            </div>
            <div className="mt-3">
              <AutoSaveForm action={updateTextAction.bind(null, params.id, "icp")}>
                <textarea className="textarea" name="value" defaultValue={blueprint.icp} rows={4} />
              </AutoSaveForm>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between">
              <h3 className="section-title">Positioning</h3>
              <form action={refineAction.bind(null, params.id, "positioning")}> 
                <input type="hidden" name="currentText" value={blueprint.positioning} />
                <button className="button-secondary" type="submit">Refine</button>
              </form>
            </div>
            <div className="mt-3">
              <AutoSaveForm action={updateTextAction.bind(null, params.id, "positioning")}>
                <textarea className="textarea" name="value" defaultValue={blueprint.positioning} rows={4} />
              </AutoSaveForm>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between">
              <h3 className="section-title">Pricing strategy</h3>
              <form action={refineAction.bind(null, params.id, "pricingStrategy")}> 
                <input type="hidden" name="currentText" value={blueprint.pricingStrategy} />
                <button className="button-secondary" type="submit">Refine</button>
              </form>
            </div>
            <div className="mt-3">
              <AutoSaveForm action={updateTextAction.bind(null, params.id, "pricingStrategy")}>
                <textarea className="textarea" name="value" defaultValue={blueprint.pricingStrategy} rows={4} />
              </AutoSaveForm>
            </div>
          </div>

          {([
            { key: "outcomes", label: "Outcomes" },
            { key: "curriculum", label: "Curriculum" },
            { key: "productionPlan", label: "Production plan" },
            { key: "proofPlan", label: "Proof plan" },
            { key: "risks", label: "Risks" }
          ] as const).map((section) => (
            <div key={section.key} className="card">
              <div className="flex items-start justify-between">
                <h3 className="section-title">{section.label}</h3>
                <form
                  action={refineAction.bind(
                    null,
                    params.id,
                    section.key
                  )}
                >
                  <input
                    type="hidden"
                    name="currentText"
                    value={JSON.stringify(
                      (blueprint as Record<string, unknown>)[section.key] ?? [],
                      null,
                      2
                    )}
                  />
                  <button className="button-secondary" type="submit">Refine</button>
                </form>
              </div>
              <div className="mt-3">
                <AutoSaveForm action={updateJsonAction.bind(null, params.id, section.key)}>
                  <textarea
                    className="textarea font-mono text-xs"
                    name="value"
                    defaultValue={JSON.stringify(
                      (blueprint as Record<string, unknown>)[section.key] ?? [],
                      null,
                      2
                    )}
                    rows={6}
                  />
                </AutoSaveForm>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
