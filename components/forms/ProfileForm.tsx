"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import type { PublicUser } from "@/types";

export function ProfileForm({ user, onSaved }: { user: PublicUser; onSaved: (u: PublicUser) => void }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      faculty: user.faculty ?? "",
      studentId: user.studentId ?? "",
      avatarUrl: user.avatarUrl ?? "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message ?? "บันทึกไม่สำเร็จ");
      return;
    }
    toast.success("บันทึกโปรไฟล์สำเร็จ");
    onSaved(json.data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">รูปโปรไฟล์</label>
        <Controller
          name="avatarUrl"
          control={control}
          render={({ field }) => (
            <ImageUploader images={field.value ? [field.value] : []} onChange={(urls) => field.onChange(urls[0] ?? "")} max={1} />
          )}
        />
      </div>
      <Input label="ชื่อ - นามสกุล" error={errors.name?.message} {...register("name")} />
      <Input label="เบอร์โทร" error={errors.phone?.message} {...register("phone")} />
      <Input label="คณะ" error={errors.faculty?.message} {...register("faculty")} />
      <Input label="รหัสนักศึกษา" error={errors.studentId?.message} {...register("studentId")} />
      <Button type="submit" loading={isSubmitting}>บันทึกการเปลี่ยนแปลง</Button>
    </form>
  );
}
