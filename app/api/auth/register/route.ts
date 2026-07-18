import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";
import { created, fail } from "@/lib/api-response";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { success } = rateLimit(`register:${getClientKey(req)}`, 5, 60_000);
  if (!success) return fail("คำขอมากเกินไป กรุณาลองใหม่ภายหลัง", 429);

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return fail("ข้อมูลไม่ถูกต้อง", 422, parsed.error.flatten());

  const { name, email, password, phone, faculty, studentId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return fail("อีเมลนี้ถูกใช้งานแล้ว", 409);

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone, faculty, studentId },
  });

  // Intentionally not signing a token / setting the auth cookie here —
  // registering creates the account but does not log the user in.
  const { password: _pw, ...safeUser } = user;
  return created(safeUser);
}
