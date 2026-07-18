"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { itemSchema, type ItemInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import { LocationField } from "@/components/map/LocationField";
import { ITEM_CATEGORIES } from "@/lib/categories";
import type { ItemWithRelations } from "@/types";

export function ItemForm({ initialItem }: { initialItem?: ItemWithRelations }) {
  const router = useRouter();
  const isEdit = !!initialItem;

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialItem
      ? {
          title: initialItem.title,
          description: initialItem.description,
          type: initialItem.type,
          category: initialItem.category,
          color: initialItem.color ?? "",
          brand: initialItem.brand ?? "",
          contact: initialItem.contact ?? "",
          location: initialItem.location,
          latitude: initialItem.latitude ?? undefined,
          longitude: initialItem.longitude ?? undefined,
          date: new Date(initialItem.date) as unknown as Date,
          images: initialItem.images,
        }
      : { type: "LOST", images: [] },
  });

  const onSubmit = async (data: ItemInput) => {
    const url = isEdit ? `/api/items/${initialItem!.id}` : "/api/items";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message ?? "บันทึกประกาศไม่สำเร็จ");
      return;
    }
    toast.success(isEdit ? "แก้ไขประกาศสำเร็จ" : "สร้างประกาศสำเร็จ");
    router.push(`/items/${json.data.id}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Select label="ประเภทประกาศ" error={errors.type?.message} {...register("type")}>
          <option value="LOST">ของหาย (Lost)</option>
          <option value="FOUND">พบของ (Found)</option>
        </Select>
        <Select label="หมวดหมู่" error={errors.category?.message} {...register("category")}>
          <option value="">เลือกหมวดหมู่</option>
          {ITEM_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
      </div>

      <Input label="ชื่อสิ่งของ" placeholder="เช่น กระเป๋าสะพายสีดำ" error={errors.title?.message} {...register("title")} />
      <Textarea label="รายละเอียด" rows={4} placeholder="อธิบายลักษณะ จุดสังเกต ฯลฯ" error={errors.description?.message} {...register("description")} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Input label="สี" placeholder="เช่น ดำ" error={errors.color?.message} {...register("color")} />
        <Input label="ยี่ห้อ" placeholder="เช่น Nike" error={errors.brand?.message} {...register("brand")} />
      </div>

      <Input
        label="ช่องทางติดต่อ (ไม่บังคับ)"
        placeholder="เช่น เบอร์โทร, LINE ID, Facebook"
        error={errors.contact?.message}
        {...register("contact")}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="สถานที่" placeholder="เช่น ตึกวิศวกรรม ชั้น 2" error={errors.location?.message} {...register("location")} />
        <Input
          label="วันที่"
          type="date"
          error={errors.date?.message}
          {...register("date")}
        />
      </div>

      <LocationField
        latitude={watch("latitude") ?? null}
        longitude={watch("longitude") ?? null}
        onChange={(lat, lng) => {
          setValue("latitude", lat, { shouldDirty: true });
          setValue("longitude", lng, { shouldDirty: true });
        }}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">รูปภาพ (สูงสุด 8 รูป)</label>
        <Controller
          name="images"
          control={control}
          render={({ field }) => <ImageUploader images={field.value ?? []} onChange={field.onChange} />}
        />
        {errors.images && <p className="mt-1 text-xs text-red-500">{errors.images.message as string}</p>}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {isEdit ? "บันทึกการแก้ไข" : "สร้างประกาศ"}
      </Button>
    </form>
  );
}
