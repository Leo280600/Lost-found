"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, PlusCircle, Bell, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/items", label: "ค้นหาประกาศ" },
  { href: "/map", label: "แผนที่" },
  { href: "/dashboard", label: "แดชบอร์ด" },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 shadow-glass">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Search size={16} />
          </span>
          <span className="text-lg tracking-tight">Lost&nbsp;<span className="text-brand-600">&amp;</span>&nbsp;Found Hub</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "focus-ring rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white/60 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white",
                pathname === l.href && "bg-white/70 text-brand-700 dark:bg-white/10 dark:text-brand-400"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {!loading && user && (
            <>
              <Link href="/items/new" className="focus-ring hidden items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-brand-700 sm:flex">
                <PlusCircle size={16} /> แจ้งประกาศ
              </Link>
              <Link href="/dashboard" aria-label="การแจ้งเตือน" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                <Bell size={18} />
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" aria-label="Admin" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <ShieldCheck size={18} />
                </Link>
              )}
              <Link href="/profile" className="focus-ring flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                <UserIcon size={16} />
              </Link>
              <button onClick={logout} aria-label="ออกจากระบบ" className="focus-ring hidden h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 sm:flex dark:hover:bg-gray-800">
                <LogOut size={16} />
              </button>
            </>
          )}
          {!loading && !user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="focus-ring rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
                สมัครสมาชิก
              </Link>
            </div>
          )}
          <button className="focus-ring flex h-9 w-9 items-center justify-center rounded-full md:hidden" onClick={() => setOpen((v) => !v)} aria-label="เมนู">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-3 shadow-glass md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="focus-ring rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/60 dark:hover:bg-white/5">
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="mt-1 flex gap-2 border-t border-gray-200/60 pt-2 dark:border-gray-700/60">
              <Link href="/login" onClick={() => setOpen(false)} className="focus-ring flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium hover:bg-white/60 dark:hover:bg-white/5">เข้าสู่ระบบ</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="focus-ring flex-1 rounded-full bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white">สมัครสมาชิก</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
