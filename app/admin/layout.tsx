import Link from "next/link";

const links = [
  { href: "/admin", label: "ภาพรวม" },
  { href: "/admin/users", label: "ผู้ใช้" },
  { href: "/admin/items", label: "ประกาศ" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr]">
      <aside className="glass h-fit space-y-1 rounded-2xl p-3 shadow-glass">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="focus-ring block rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white/60 dark:text-gray-300 dark:hover:bg-white/10">
            {l.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
