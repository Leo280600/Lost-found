import { z } from "zod";
import { ITEM_CATEGORY_VALUES } from "@/lib/categories";

export const registerSchema = z.object({
  name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร").max(100),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  phone: z.string().optional(),
  faculty: z.string().optional(),
  studentId: z.string().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(30).optional().nullable().or(z.literal("")).transform((v) => (v ? v : null)),
  faculty: z.string().max(150).optional().nullable().or(z.literal("")).transform((v) => (v ? v : null)),
  studentId: z.string().max(50).optional().nullable().or(z.literal("")).transform((v) => (v ? v : null)),
  avatarUrl: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || z.string().url().safeParse(v).success, "ลิงก์รูปภาพไม่ถูกต้อง")
    .transform((v) => (v ? v : null)),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const itemSchema = z.object({
  title: z.string().min(3, "ชื่อสิ่งของต้องมีอย่างน้อย 3 ตัวอักษร").max(150),
  description: z.string().min(10, "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร").max(3000),
  type: z.enum(["LOST", "FOUND"]),
  category: z.enum(ITEM_CATEGORY_VALUES, { errorMap: () => ({ message: "กรุณาเลือกหมวดหมู่" }) }),
  color: z.string().max(50).optional().nullable(),
  brand: z.string().max(50).optional().nullable(),
  contact: z.string().max(200, "ช่องทางติดต่อยาวเกินไป").optional().nullable(),
  location: z.string().min(2, "กรุณาระบุสถานที่").max(200),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  date: z.coerce.date(),
  images: z.array(z.string().url()).max(8, "อัปโหลดได้สูงสุด 8 รูป").default([]),
});
export type ItemInput = z.infer<typeof itemSchema>;

export const itemUpdateSchema = itemSchema.partial().extend({
  status: z.enum(["LOST", "FOUND", "RETURNED"]).optional(),
});
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>;

export const claimSchema = z.object({
  itemId: z.string().min(1),
  reason: z.string().min(10, "กรุณาระบุเหตุผลอย่างน้อย 10 ตัวอักษร").max(1000),
  evidence: z.array(z.string().url()).max(5).default([]),
});
export type ClaimInput = z.infer<typeof claimSchema>;

export const claimDecisionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const itemQuerySchema = z.object({
  q: z.string().optional(),
  type: z.enum(["LOST", "FOUND"]).optional(),
  status: z.enum(["LOST", "FOUND", "RETURNED"]).optional(),
  category: z.enum(ITEM_CATEGORY_VALUES).optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  location: z.string().optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
