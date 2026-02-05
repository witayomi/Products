import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function IntakePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  const intake = await prisma.intake.findFirst({
    where: { projectId: params.id, project: { userId: user.id } }
  });
  if (!intake) redirect(`/projects/${params.id}/opportunities`);

  return (
    <div className="card">
      <h2 className="section-title">Intake overview</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="label">Niche</p>
          <p className="text-sm text-slate-700">{intake.niche}</p>
        </div>
        <div>
          <p className="label">Audience</p>
          <p className="text-sm text-slate-700">{intake.audience}</p>
        </div>
        <div>
          <p className="label">Expertise</p>
          <p className="text-sm text-slate-700">{intake.expertise}</p>
        </div>
        <div>
          <p className="label">Time available</p>
          <p className="text-sm text-slate-700">{intake.timeAvailable}</p>
        </div>
        <div>
          <p className="label">Preferred format</p>
          <p className="text-sm text-slate-700">{intake.preferredFormat || "Not specified"}</p>
        </div>
        <div>
          <p className="label">Budget constraints</p>
          <p className="text-sm text-slate-700">{intake.budgetConstraints}</p>
        </div>
        <div>
          <p className="label">Revenue goal</p>
          <p className="text-sm text-slate-700">{intake.revenueGoal || "Not specified"}</p>
        </div>
        <div>
          <p className="label">Market</p>
          <p className="text-sm text-slate-700">{intake.market}</p>
        </div>
        <div className="md:col-span-2">
          <p className="label">Existing assets</p>
          <p className="text-sm text-slate-700">{intake.existingAssets}</p>
        </div>
      </div>
    </div>
  );
}
