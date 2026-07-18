import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized, forbidden, notFound } from "@/lib/api-response";
import { deleteImagesFromStorage } from "@/lib/supabase";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();
  const { id } = await params;

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return notFound("ไม่พบประกาศนี้");

  await prisma.item.delete({ where: { id } });
  await deleteImagesFromStorage(item.images);

  return ok({ message: "ลบประกาศสำเร็จ" });
}
