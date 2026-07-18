import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized } from "@/lib/api-response";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) return unauthorized();

  const { password: _pw, ...safeUser } = user;
  return ok(safeUser);
}
