import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-10">
      <Card className="w-full space-y-6 p-8">
        <div className="space-y-1 text-center">
          <h1 className="font-[var(--font-display)] text-2xl font-bold">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">ยินดีต้อนรับกลับสู่ Lost &amp; Found Hub</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:underline">สมัครสมาชิก</Link>
        </p>
      </Card>
    </div>
  );
}
