import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { success } = rateLimit(`login:${getClientKey(req)}`, 10, 60_000);
  if (!success) return fail("คำขอมากเกินไป กรุณาลองใหม่ภายหลัง", 429);

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return fail("ข้อมูลไม่ถูกต้อง", 422, parsed.error.flatten());

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return fail("อีเมลหรือรหัสผ่านไม่ถูกต้อง", 401);
  if (user.isBanned) return fail("บัญชีนี้ถูกระงับการใช้งาน", 403);

  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) return fail("อีเมลหรือรหัสผ่านไม่ถูกต้อง", 401);

  const token = await signToken({ userId: user.id, email: user.email, role: user.role });
  await setAuthCookie(token);

  const { password: _pw, ...safeUser } = user;
  return ok(safeUser);
}
