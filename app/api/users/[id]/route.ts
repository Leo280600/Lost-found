import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations";
import { ok, fail, unauthorized, forbidden, notFound } from "@/lib/api-response";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return notFound("ไม่พบผู้ใช้");
  const { password: _pw, ...safeUser } = user;
  return ok(safeUser);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  const { id } = await params;
  if (auth.userId !== id && auth.role !== "ADMIN") return forbidden();

  const body = await req.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return fail("ข้อมูลไม่ถูกต้อง", 422, parsed.error.flatten());

  const user = await prisma.user.update({ where: { id }, data: parsed.data });
  const { password: _pw, ...safeUser } = user;
  return ok(safeUser);
}
