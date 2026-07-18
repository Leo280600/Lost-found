import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api-response";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const favorites = await prisma.favorite.findMany({
    where: { userId: auth.userId },
    include: {
      item: {
        include: { owner: { select: { id: true, name: true, avatarUrl: true, phone: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(favorites.map((f) => f.item));
}
