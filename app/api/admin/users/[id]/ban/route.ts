import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized, forbidden, notFound, fail } from "@/lib/api-response";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();
  const { id } = await params;

  if (id === auth.userId) return fail("ไม่สามารถระงับบัญชีของตนเองได้", 400);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return notFound("ไม่พบผู้ใช้");

  const body = await req.json().catch(() => ({}));
  const isBanned = typeof body?.isBanned === "boolean" ? body.isBanned : !user.isBanned;

  const updated = await prisma.user.update({ where: { id }, data: { isBanned } });
  const { password: _pw, ...safeUser } = updated;
  return ok(safeUser);
}
