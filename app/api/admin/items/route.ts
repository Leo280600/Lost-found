import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized, forbidden } from "@/lib/api-response";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });

  return ok(items);
}
