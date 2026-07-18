import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { ItemGallery } from "@/components/items/ItemGallery";
import { ItemActions } from "@/components/items/ItemActions";
import { ItemLocationCard } from "@/components/map/ItemLocationCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MapPin, Calendar, Tag, Palette, User as UserIcon, Phone, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import type { ItemWithRelations } from "@/types";
import { getCategoryLabel } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthUser();

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true, phone: true, faculty: true } },
      _count: { select: { favorites: true } },
    },
  });
  if (!item) notFound();

  let isFavorited = false;
  if (auth) {
    const fav = await prisma.favorite.findUnique({ where: { userId_itemId: { userId: auth.userId, itemId: id } } });
    isFavorited = !!fav;
  }

  const fullItem = { ...item, favoritesCount: item._count.favorites, isFavorited } as unknown as ItemWithRelations;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <ItemGallery images={item.images} title={item.title} />
      </div>

      <div className="space-y-5 lg:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
          <StatusBadge status={item.status} />
        </div>

        {item.contact ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <MessageCircle size={16} /> ช่องทางติดต่อ: {item.contact}
          </div>
        ) : null}

        <Card className="space-y-3 p-5">
          <InfoRow icon={<Tag size={15} />} label="หมวดหมู่" value={getCategoryLabel(item.category)} />
          <InfoRow icon={<MapPin size={15} />} label="สถานที่" value={item.location} />
          <InfoRow icon={<Calendar size={15} />} label="วันที่" value={format(new Date(item.date), "d MMMM yyyy")} />
          {item.color && <InfoRow icon={<Palette size={15} />} label="สี" value={item.color} />}
          {item.brand && <InfoRow icon={<Tag size={15} />} label="ยี่ห้อ" value={item.brand} />}
        </Card>

        <Card className="space-y-2 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white">รายละเอียด</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.description}</p>
        </Card>

        {item.latitude != null && item.longitude != null && (
          <ItemLocationCard
            latitude={item.latitude}
            longitude={item.longitude}
            status={item.status}
            location={item.location}
          />
        )}

        <Card className="space-y-3 p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white">เจ้าของประกาศ</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
              <UserIcon size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{item.owner.name}</p>
              {item.owner.faculty && <p className="text-xs text-gray-500 dark:text-gray-400">{item.owner.faculty}</p>}
            </div>
          </div>
          {auth && item.owner.phone && (
            <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"><Phone size={14} /> {item.owner.phone}</p>
          )}
        </Card>

        <ItemActions item={fullItem} />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-brand-500">{icon}</span>
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>
      <span className="font-medium text-gray-800 dark:text-gray-100">{value}</span>
    </div>
  );
}
