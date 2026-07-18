import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { ok, fail, unauthorized } from "@/lib/api-response";
import { rateLimit, getClientKey } from "@/lib/rate-limit";
import {
  uploadImageToStorage,
  deleteImagesFromStorage,
  getStoragePathFromUrl,
  isOwnedStoragePath,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const { success } = rateLimit(`upload:${getClientKey(req)}`, 30, 60_000);
  if (!success) return fail("คำขออัปโหลดมากเกินไป กรุณาลองใหม่ภายหลัง", 429);

  const formData = await req.formData().catch(() => null);
  if (!formData) return fail("ข้อมูลฟอร์มไม่ถูกต้อง", 422);

  const file = formData.get("file");
  if (!(file instanceof File)) return fail("ไม่พบไฟล์รูปภาพ", 422);

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return fail("รองรับเฉพาะไฟล์ JPG, JPEG, PNG หรือ WEBP เท่านั้น", 422);
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return fail("ขนาดไฟล์ต้องไม่เกิน 5MB", 422);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, path } = await uploadImageToStorage(buffer, file.type, auth.userId);
    return ok({ url, path });
  } catch (err) {
    console.error("Upload failed:", err);
    return fail("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", 500);
  }
}

// Deletes a single image from Supabase Storage — used when the user removes
// an image while creating/editing a listing, before the form is submitted.
export async function DELETE(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const body = await req.json().catch(() => null);
  const url = body?.url;
  if (!url || typeof url !== "string") return fail("ไม่พบลิงก์รูปภาพ", 422);

  const path = getStoragePathFromUrl(url);
  if (!path) return fail("ลิงก์รูปภาพไม่ถูกต้อง", 422);

  if (auth.role !== "ADMIN" && !isOwnedStoragePath(path, auth.userId)) {
    return fail("ไม่มีสิทธิ์ลบรูปภาพนี้", 403);
  }

  await deleteImagesFromStorage([url]);
  return ok({ message: "ลบรูปภาพสำเร็จ" });
}
