import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { claimSchema } from "@/lib/validations";
import { ok, created, fail, unauthorized, notFound } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") ?? "mine"; // "mine" | "received"

  const claims =
    scope === "received"
      ? await prisma.claim.findMany({
          where: { item: { ownerId: auth.userId } },
          include: { item: true, user: { select: { id: true, name: true, avatarUrl: true, phone: true } } },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.claim.findMany({
          where: { userId: auth.userId },
          include: { item: true },
          orderBy: { createdAt: "desc" },
        });

  return ok(claims);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) return fail("ข้อมูลไม่ถูกต้อง", 422, parsed.error.flatten());

  const { itemId, reason, evidence } = parsed.data;
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) return notFound("ไม่พบประกาศนี้");
  if (item.ownerId === auth.userId) return fail("คุณไม่สามารถขอรับคืนของของคุณเองได้", 400);

  const claim = await prisma.claim.create({
    data: { itemId, userId: auth.userId, reason, evidence },
  });

  await prisma.notification.create({
    data: {
      userId: item.ownerId,
      type: "CLAIM_REQUESTED",
      title: "มีคนขอรับของคืน",
      message: `มีผู้ใช้ขอรับคืนของ "${item.title}" ของคุณ`,
      link: `/items/${item.id}`,
    },
  });

  return created(claim);
}
