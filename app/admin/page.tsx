"use client";

import { useEffect, useState } from "react";
import { Users2, PackageX, PackageCheck, PackageOpen, HandHeart, ShieldOff } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface Stats {
  totalUsers: number;
  lostItems: number;
  foundItems: number;
  returnedItems: number;
  pendingClaims: number;
  bannedUsers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then((json) => setStats(json.data));
  }, []);

  const cards = stats
    ? [
        { label: "สมาชิกทั้งหมด", value: stats.totalUsers, icon: <Users2 size={18} /> },
        { label: "ของหาย", value: stats.lostItems, icon: <PackageX size={18} /> },
        { label: "พบของ", value: stats.foundItems, icon: <PackageCheck size={18} /> },
        { label: "คืนแล้ว", value: stats.returnedItems, icon: <PackageOpen size={18} /> },
        { label: "คำขอรอดำเนินการ", value: stats.pendingClaims, icon: <HandHeart size={18} /> },
        { label: "บัญชีถูกระงับ", value: stats.bannedUsers, icon: <ShieldOff size={18} /> },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">ภาพรวมระบบ Lost &amp; Found Hub</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="flex flex-col items-center gap-1 p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
              {c.icon}
            </div>
            <span className="font-[var(--font-display)] text-2xl font-bold">{c.value.toLocaleString()}</span>
            <span className="text-xs text-gray-500">{c.label}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
