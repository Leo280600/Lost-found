"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  _count: { items: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const json = await res.json();
    setUsers(json.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleBan = async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}/ban`, { method: "PUT" });
    const json = await res.json();
    if (!res.ok) return toast.error(json.message ?? "ทำรายการไม่สำเร็จ");
    toast.success("อัปเดตสถานะผู้ใช้แล้ว");
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">จัดการผู้ใช้</h1>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-700">
            <tr>
              <th className="p-4">ชื่อ</th>
              <th className="p-4">อีเมล</th>
              <th className="p-4">บทบาท</th>
              <th className="p-4">ประกาศ</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">{u._count.items}</td>
                <td className="p-4">
                  {u.isBanned ? <span className="text-red-500">ถูกระงับ</span> : <span className="text-emerald-600">ปกติ</span>}
                </td>
                <td className="p-4">
                  {u.role !== "ADMIN" && (
                    <Button size="sm" variant={u.isBanned ? "secondary" : "danger"} onClick={() => toggleBan(u.id)}>
                      {u.isBanned ? "ปลดระงับ" : "ระงับบัญชี"}
                    </Button>
                  )}
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
