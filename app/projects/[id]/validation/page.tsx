import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateValidation, updateValidationNotes } from "@/lib/actions";
import AutoSaveForm from "@/components/AutoSaveForm";

async function generateAction(projectId: string) {
  "use server";
  await generateValidation(projectId);
}

async function saveNotes(projectId: string, formData: FormData) {
  "use server";
  const notes = String(formData.get("notes") ?? "");
  await updateValidationNotes(projectId, notes);
}

export default async function ValidationPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const validation = await prisma.validation.findFirst({
    where: { projectId: params.id, project: { userId: user.id } }
  });

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="section-title">Validation Sprint</h2>
          <p className="text-sm text-slate-600">Generate a lean plan to validate demand.</p>
          <p className="mt-2 text-xs text-slate-500">Regenerating will overwrite the current plan.</p>
        </div>
        <form action={generateAction.bind(null, params.id)}>
          <button className="button" type="submit">Generate plan</button>
        </form>
      </div>

      {!validation ? (
        <div className="card">
          <p className="text-sm text-slate-600">Select an idea to start validation.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h3 className="section-title">Interview questions</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-slate-700">
              {(validation.interviewQuestions as string[]).map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </div>
          <div className="card">
            <h3 className="section-title">Experiments</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              {(validation.experiments as { type: string; description: string }[]).map((experiment) => (
                <li key={experiment.description}>
                  <p className="font-medium">{experiment.type}</p>
                  <p>{experiment.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h3 className="section-title">Success metrics</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {(validation.successMetrics as string[] | undefined)?.map((metric) => (
                <li key={metric}>{metric}</li>
              )) ?? []}
            </ul>
          </div>
          <div className="card md:col-span-2">
            <h3 className="section-title">Notes & results</h3>
            <div className="mt-3">
              <AutoSaveForm action={saveNotes.bind(null, params.id)}>
                <textarea className="textarea" name="notes" defaultValue={validation.notes ?? ""} rows={5} />
              </AutoSaveForm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
