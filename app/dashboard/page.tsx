"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, PackageSearch, Heart, HandHeart, Inbox, Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Tab = "items" | "favorites" | "claims-sent" | "claims-received" | "notifications";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "items", label: "ประกาศของฉัน", icon: <PackageSearch size={15} /> },
  { id: "favorites", label: "รายการโปรด", icon: <Heart size={15} /> },
  { id: "claims-sent", label: "คำขอที่ส่ง", icon: <HandHeart size={15} /> },
  { id: "claims-received", label: "คำขอที่ได้รับ", icon: <Inbox size={15} /> },
  { id: "notifications", label: "การแจ้งเตือน", icon: <Bell size={15} /> },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("items");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === "items") {
        const res = await fetch(`/api/items?limit=50`);
        const json = await res.json();
        setData((json.data?.items ?? []).filter((i: any) => i.ownerId === user?.id));
      } else if (tab === "favorites") {
        const res = await fetch(`/api/favorites`);
        const json = await res.json();
        setData(json.data ?? []);
      } else if (tab === "claims-sent") {
        const res = await fetch(`/api/claims?scope=mine`);
        const json = await res.json();
        setData(json.data ?? []);
      } else if (tab === "claims-received") {
        const res = await fetch(`/api/claims?scope=received`);
        const json = await res.json();
        setData(json.data ?? []);
      } else if (tab === "notifications") {
        const res = await fetch(`/api/notifications`);
        const json = await res.json();
        setData(json.data ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

  const decide = async (claimId: string, status: "APPROVED" | "REJECTED") => {
    const res = await fetch(`/api/claims/${claimId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return toast.error("ทำรายการไม่สำเร็จ");
    toast.success(status === "APPROVED" ? "อนุมัติคำขอแล้ว" : "ปฏิเสธคำขอแล้ว");
    load();
  };

  if (!user) {
    return <p className="py-20 text-center text-sm text-gray-500">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">แดชบอร์ดของฉัน</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">สวัสดี, {user.name}</p>
      </div>

      <div className="glass flex flex-wrap gap-1 rounded-2xl p-1.5 shadow-glass">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "focus-ring flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition",
              tab === t.id ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-white/60 dark:text-gray-300 dark:hover:bg-white/10"
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-gray-500">กำลังโหลด...</p>
      ) : data.length === 0 ? (
        <Card className="p-10 text-center text-sm text-gray-500">ไม่มีข้อมูล</Card>
      ) : tab === "items" || tab === "favorites" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`} className="focus-ring">
              <Card className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="line-clamp-1 font-medium">{item.title}</p>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs text-gray-500">{item.location}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : tab === "notifications" ? (
        <div className="space-y-2">
          {data.map((n) => (
            <Card key={n.id} className={cn("p-4", !n.isRead && "border-l-4 border-brand-500")}>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-500">{n.message}</p>
              <p className="mt-1 text-xs text-gray-400">{format(new Date(n.createdAt), "d MMM yyyy HH:mm")}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((c) => (
            <Card key={c.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{c.item?.title}</p>
                <p className="text-sm text-gray-500">{c.reason}</p>
                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">{c.status}</span>
              </div>
              {tab === "claims-received" && c.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => decide(c.id, "APPROVED")}><Check size={14} /> อนุมัติ</Button>
                  <Button size="sm" variant="danger" onClick={() => decide(c.id, "REJECTED")}><X size={14} /> ปฏิเสธ</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
