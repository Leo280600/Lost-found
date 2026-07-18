"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.message ?? "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }
    await refresh(); // updates Navbar + every component reading useAuth() right away
    toast.success("เข้าสู่ระบบสำเร็จ");
    router.push(params.get("redirect") || "/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="อีเมล" type="email" placeholder="you@university.ac.th" error={errors.email?.message} {...register("email")} />
      <Input label="รหัสผ่าน" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
      {serverError && <p className="text-sm text-red-500">{serverError}</p>}
      <Button type="submit" loading={isSubmitting} className="w-full">เข้าสู่ระบบ</Button>
    </form>
  );
}
