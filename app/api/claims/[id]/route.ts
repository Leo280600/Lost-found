import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { claimDecisionSchema } from "@/lib/validations";
import { ok, fail, unauthorized, forbidden, notFound } from "@/lib/api-response";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();
  const { id } = await params;

  const claim = await prisma.claim.findUnique({ where: { id }, include: { item: true } });
  if (!claim) return notFound("ไม่พบคำขอนี้");
  if (claim.item.ownerId !== auth.userId && auth.role !== "ADMIN") return forbidden();

  const body = await req.json().catch(() => null);
  const parsed = claimDecisionSchema.safeParse(body);
  if (!parsed.success) return fail("ข้อมูลไม่ถูกต้อง", 422, parsed.error.flatten());

  const updated = await prisma.claim.update({ where: { id }, data: { status: parsed.data.status } });

  if (parsed.data.status === "APPROVED") {
    await prisma.item.update({ where: { id: claim.itemId }, data: { status: "RETURNED" } });
  }

  await prisma.notification.create({
    data: {
      userId: claim.userId,
      type: parsed.data.status === "APPROVED" ? "CLAIM_APPROVED" : "CLAIM_REJECTED",
      title: parsed.data.status === "APPROVED" ? "ประกาศถูกอนุมัติ" : "ประกาศถูกปฏิเสธ",
      message:
        parsed.data.status === "APPROVED"
          ? `คำขอรับคืนของ "${claim.item.title}" ได้รับการอนุมัติ`
          : `คำขอรับคืนของ "${claim.item.title}" ถูกปฏิเสธ`,
      link: `/items/${claim.itemId}`,
    },
  });

  return ok(updated);
}
