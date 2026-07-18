import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized, forbidden } from "@/lib/api-response";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, phone: true, faculty: true,
      studentId: true, avatarUrl: true, role: true, isBanned: true, createdAt: true,
      _count: { select: { items: true } },
    },
  });

  return ok(users);
}
