import Sidebar from "@/components/Sidebar";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: user.id }
  });
  if (!project) redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar projectId={params.id} />
      <main className="flex-1 bg-slate-50 px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-500">{project.niche}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
