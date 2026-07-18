import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ItemForm } from "@/components/forms/ItemForm";
import { Card } from "@/components/ui/Card";
import type { ItemWithRelations } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  const item = await prisma.item.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true, avatarUrl: true, phone: true } } },
  });

  if (!item) notFound();
  if (item.ownerId !== auth.userId && auth.role !== "ADMIN") redirect(`/items/${id}`);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">แก้ไขประกาศ</h1>
      <Card className="p-6 sm:p-8">
        <ItemForm initialItem={item as unknown as ItemWithRelations} />
      </Card>
    </div>
  );
}
