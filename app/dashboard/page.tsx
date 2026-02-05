import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="px-10 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <h1 className="text-2xl font-semibold">Your Projects</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link className="button-secondary" href="/projects/new">New project</Link>
          <form action={logout}>
            <button className="button-secondary" type="submit">Log out</button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}/opportunities`} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{project.market}</p>
                <h2 className="text-lg font-semibold text-slate-900">{project.name}</h2>
                <p className="text-sm text-slate-600">{project.goal}</p>
              </div>
              <span className="badge">{project.niche}</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="card">
            <p className="text-sm text-slate-600">No projects yet. Create your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
