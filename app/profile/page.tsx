"use client";

import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();

  if (loading) return <p className="py-20 text-center text-sm text-gray-500">กำลังโหลด...</p>;
  if (!user) return <p className="py-20 text-center text-sm text-gray-500">กรุณาเข้าสู่ระบบ</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">โปรไฟล์ของฉัน</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>
      <Card className="p-6 sm:p-8">
        <ProfileForm user={user} onSaved={() => refresh()} />
      </Card>
    </div>
  );
}
