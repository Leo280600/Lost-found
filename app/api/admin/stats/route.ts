import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized, forbidden } from "@/lib/api-response";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const [totalUsers, lostItems, foundItems, returnedItems, pendingClaims, bannedUsers] = await Promise.all([
    prisma.user.count(),
    prisma.item.count({ where: { status: "LOST" } }),
    prisma.item.count({ where: { status: "FOUND" } }),
    prisma.item.count({ where: { status: "RETURNED" } }),
    prisma.claim.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { isBanned: true } }),
  ]);

  return ok({ totalUsers, lostItems, foundItems, returnedItems, pendingClaims, bannedUsers });
}
