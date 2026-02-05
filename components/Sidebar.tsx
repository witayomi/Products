import Link from "next/link";

const navItems = [
  { href: "intake", label: "Intake" },
  { href: "opportunities", label: "Opportunities" },
  { href: "validation", label: "Validation" },
  { href: "blueprint", label: "Blueprint" },
  { href: "export", label: "Export" }
];

export default function Sidebar({ projectId }: { projectId: string }) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white px-6 py-8">
      <div className="mb-6">
        <Link className="text-lg font-semibold text-slate-900" href="/dashboard">CreatorX</Link>
        <p className="text-xs text-slate-500">Product Creator</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={`/projects/${projectId}/${item.href}`}
            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
