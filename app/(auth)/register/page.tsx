import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-10">
      <Card className="w-full space-y-6 p-8">
        <div className="space-y-1 text-center">
          <h1 className="font-[var(--font-display)] text-2xl font-bold">สมัครสมาชิก</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">สร้างบัญชีเพื่อเริ่มแจ้งประกาศของหาย/ของพบ</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </Card>
    </div>
  );
}
