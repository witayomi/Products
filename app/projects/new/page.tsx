import { redirect } from "next/navigation";
import { createProject } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";

async function createProjectAction(formData: FormData) {
  "use server";
  const project = await createProject({
    name: String(formData.get("name")),
    niche: String(formData.get("niche")),
    market: String(formData.get("market")),
    goal: String(formData.get("goal")),
    intake: {
      niche: String(formData.get("niche")),
      audience: String(formData.get("audience")),
      expertise: String(formData.get("expertise")),
      timeAvailable: String(formData.get("timeAvailable")),
      preferredFormat: String(formData.get("preferredFormat") || "") || undefined,
      budgetConstraints: String(formData.get("budgetConstraints")),
      revenueGoal: String(formData.get("revenueGoal") || "") || undefined,
      market: String(formData.get("market")),
      existingAssets: String(formData.get("existingAssets"))
    }
  });

  redirect(`/projects/${project.id}/opportunities`);
}

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Create a project</h1>
      <p className="mt-2 text-sm text-slate-600">
        Start with a quick intake to shape your opportunity board and blueprint.
      </p>

      <form action={createProjectAction} className="mt-8 grid gap-6">
        <div className="card">
          <h2 className="section-title">Project details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Project name</label>
              <input className="input" id="name" name="name" required />
            </div>
            <div>
              <label className="label" htmlFor="goal">Primary goal</label>
              <input className="input" id="goal" name="goal" required />
            </div>
            <div>
              <label className="label" htmlFor="niche">Niche / industry</label>
              <input className="input" id="niche" name="niche" required />
            </div>
            <div>
              <label className="label" htmlFor="market">Market (country/region)</label>
              <input className="input" id="market" name="market" required />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Intake</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="audience">Who do you want to serve?</label>
              <input className="input" id="audience" name="audience" required />
            </div>
            <div>
              <label className="label" htmlFor="expertise">Your expertise & credibility</label>
              <input className="input" id="expertise" name="expertise" required />
            </div>
            <div>
              <label className="label" htmlFor="timeAvailable">Time available to create</label>
              <input className="input" id="timeAvailable" name="timeAvailable" required />
            </div>
            <div>
              <label className="label" htmlFor="preferredFormat">Preferred format (optional)</label>
              <input className="input" id="preferredFormat" name="preferredFormat" />
            </div>
            <div>
              <label className="label" htmlFor="budgetConstraints">Budget constraints</label>
              <input className="input" id="budgetConstraints" name="budgetConstraints" required />
            </div>
            <div>
              <label className="label" htmlFor="revenueGoal">Revenue goal (optional)</label>
              <input className="input" id="revenueGoal" name="revenueGoal" />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="existingAssets">Existing assets</label>
              <textarea className="textarea" id="existingAssets" name="existingAssets" required />
            </div>
          </div>
        </div>

        <button className="button w-fit" type="submit">Create project</button>
      </form>
    </div>
  );
}
