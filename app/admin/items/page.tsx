"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { getCategoryLabel } from "@/lib/categories";

interface AdminItem {
  id: string;
  title: string;
  status: "LOST" | "FOUND" | "RETURNED";
  category: string;
  owner: { name: string; email: string };
}

export default function AdminItemsPage() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/items");
    const json = await res.json();
    setItems(json.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("ยืนยันการลบประกาศนี้?")) return;
    const res = await fetch(`/api/admin/items/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("ลบไม่สำเร็จ");
    toast.success("ลบประกาศสำเร็จ");
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">จัดการประกาศ</h1>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700">
            <tr>
              <th className="p-4">ชื่อ</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">เจ้าของ</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {!loading && items.map((i) => (
              <tr key={i.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                <td className="p-4 font-medium">{i.title}</td>
                <td className="p-4 text-gray-500">{getCategoryLabel(i.category)}</td>
                <td className="p-4 text-gray-500">{i.owner?.name}</td>
                <td className="p-4"><StatusBadge status={i.status} /></td>
                <td className="p-4">
                  <Button size="sm" variant="danger" onClick={() => remove(i.id)}>ลบ</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-6 text-center text-sm text-gray-500">กำลังโหลด...</p>}
      </Card>
    </div>
  );
}
