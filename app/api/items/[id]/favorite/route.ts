import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized, notFound } from "@/lib/api-response";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  const { id: itemId } = await params;

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return notFound("ไม่พบประกาศนี้");

  const existing = await prisma.favorite.findUnique({
    where: { userId_itemId: { userId: auth.userId, itemId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return ok({ favorited: false });
  }

  await prisma.favorite.create({ data: { userId: auth.userId, itemId } });
  return ok({ favorited: true });
}
