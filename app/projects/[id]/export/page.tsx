import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createShareLink, exportMarkdown, exportPdf } from "@/lib/actions";

async function exportMarkdownAction(projectId: string) {
  "use server";
  await exportMarkdown(projectId);
}

async function exportPdfAction(projectId: string) {
  "use server";
  await exportPdf(projectId);
}

async function shareAction(projectId: string) {
  "use server";
  await createShareLink(projectId);
}

export default async function ExportPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const exports = await prisma.export.findMany({
    where: { projectId: params.id, project: { userId: user.id } },
    orderBy: { createdAt: "desc" }
  });

  const shareLink = await prisma.shareLink.findUnique({
    where: { projectId: params.id }
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="section-title">Export & Share</h2>
        <p className="text-sm text-slate-600">Download or share your blueprint.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <form action={exportMarkdownAction.bind(null, params.id)}>
            <button className="button" type="submit">Export markdown</button>
          </form>
          <form action={exportPdfAction.bind(null, params.id)}>
            <button className="button-secondary" type="submit">Export PDF</button>
          </form>
          <form action={shareAction.bind(null, params.id)}>
            <button className="button-secondary" type="submit">Create share link</button>
          </form>
        </div>
        {shareLink && (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            Share URL: {`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/share/${shareLink.token}`}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="section-title">Recent exports</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {exports.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span className="text-slate-700">{item.type.toUpperCase()}</span>
              <a className="text-brand-500" href={item.url}>Download</a>
            </li>
          ))}
          {exports.length === 0 && <li className="text-slate-500">No exports yet.</li>}
        </ul>
      </div>
    </div>
  );
}
