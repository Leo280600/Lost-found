import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized, forbidden, notFound } from "@/lib/api-response";

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  const { id } = await params;

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) return notFound("ไม่พบการแจ้งเตือน");
  if (notification.userId !== auth.userId) return forbidden();

  const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } });
  return ok(updated);
}
