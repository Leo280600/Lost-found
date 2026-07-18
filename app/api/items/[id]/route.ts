import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { itemUpdateSchema } from "@/lib/validations";
import { ok, fail, unauthorized, forbidden, notFound } from "@/lib/api-response";
import { deleteImagesFromStorage } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthUser();

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true, phone: true, faculty: true } },
      _count: { select: { favorites: true } },
    },
  });
  if (!item) return notFound("ไม่พบประกาศนี้");

  let isFavorited = false;
  if (auth) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_itemId: { userId: auth.userId, itemId: id } },
    });
    isFavorited = !!fav;
  }

  return ok({ ...item, favoritesCount: item._count.favorites, isFavorited });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  const { id } = await params;

  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing) return notFound("ไม่พบประกาศนี้");
  if (existing.ownerId !== auth.userId && auth.role !== "ADMIN") return forbidden();

  const body = await req.json().catch(() => null);
  const parsed = itemUpdateSchema.safeParse(body);
  if (!parsed.success) return fail("ข้อมูลไม่ถูกต้อง", 422, parsed.error.flatten());

  const updateData = { ...parsed.data };
  // The form only sends `type`, not `status`. Keep them in sync so changing
  // ของหาย <-> พบของ actually reflects everywhere status is used (dashboard
  // badges, home page "latest lost/found" sections, filters). Once an item
  // has been marked RETURNED it's considered resolved, so a type edit alone
  // shouldn't silently reopen it.
  if (updateData.type && updateData.status === undefined && existing.status !== "RETURNED") {
    updateData.status = updateData.type;
  }

  const item = await prisma.item.update({
    where: { id },
    data: updateData,
    include: { owner: { select: { id: true, name: true, avatarUrl: true, phone: true } } },
  });

  if (parsed.data.images) {
    const removed = existing.images.filter((url) => !parsed.data.images!.includes(url));
    if (removed.length > 0) await deleteImagesFromStorage(removed);
  }

  return ok(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  const { id } = await params;

  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing) return notFound("ไม่พบประกาศนี้");
  if (existing.ownerId !== auth.userId && auth.role !== "ADMIN") return forbidden();

  await prisma.item.delete({ where: { id } });
  await deleteImagesFromStorage(existing.images);

  return ok({ message: "ลบประกาศสำเร็จ" });
}
