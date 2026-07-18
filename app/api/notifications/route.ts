import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api-response";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const notifications = await prisma.notification.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return ok(notifications);
}
