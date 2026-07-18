"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function RegisterForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.message ?? "สมัครสมาชิกไม่สำเร็จ");
      return;
    }
    await refresh();
    toast.success("สมัครสมาชิกสำเร็จ");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="ชื่อ - นามสกุล" placeholder="ชื่อของคุณ" error={errors.name?.message} {...register("name")} />
      <Input label="อีเมล" type="email" placeholder="you@university.ac.th" error={errors.email?.message} {...register("email")} />
      <Input label="รหัสผ่าน" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" error={errors.password?.message} {...register("password")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="เบอร์โทร" placeholder="08x-xxx-xxxx" error={errors.phone?.message} {...register("phone")} />
        <Input label="รหัสนักศึกษา" placeholder="ไม่บังคับ" error={errors.studentId?.message} {...register("studentId")} />
      </div>
      <Input label="คณะ" placeholder="เช่น วิศวกรรมศาสตร์" error={errors.faculty?.message} {...register("faculty")} />
      {serverError && <p className="text-sm text-red-500">{serverError}</p>}
      <Button type="submit" loading={isSubmitting} className="w-full">สมัครสมาชิก</Button>
    </form>
  );
}
