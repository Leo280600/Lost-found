"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";

const claimFormSchema = z.object({
  reason: z.string().min(10, "กรุณาระบุเหตุผลอย่างน้อย 10 ตัวอักษร").max(1000),
  evidence: z.array(z.string().url()).max(5).default([]),
});
type ClaimFormInput = z.infer<typeof claimFormSchema>;

export function ClaimForm({ itemId, onSuccess }: { itemId: string; onSuccess: () => void }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ClaimFormInput>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: { evidence: [] },
  });

  const onSubmit = async (data: ClaimFormInput) => {
    const res = await fetch("/api/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, ...data }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message ?? "ส่งคำขอไม่สำเร็จ");
      return;
    }
    toast.success("ส่งคำขอรับของคืนสำเร็จ กรุณารอเจ้าของประกาศตรวจสอบ");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        label="เหตุผลที่คุณคิดว่าเป็นเจ้าของ"
        rows={4}
        placeholder="อธิบายจุดสังเกต หรือหลักฐานความเป็นเจ้าของ"
        error={errors.reason?.message}
        {...register("reason")}
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">แนบหลักฐาน (ไม่บังคับ)</label>
        <Controller
          name="evidence"
          control={control}
          render={({ field }) => <ImageUploader images={field.value ?? []} onChange={field.onChange} max={5} />}
        />
      </div>
      <Button type="submit" loading={isSubmitting} className="w-full">ส่งคำขอรับของคืน</Button>
    </form>
  );
}
