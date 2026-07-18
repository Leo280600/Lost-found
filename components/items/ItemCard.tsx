import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Heart, Tag, MessageCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import type { ItemWithRelations } from "@/types";
import { getCategoryLabel } from "@/lib/categories";
import { format } from "date-fns";

export function ItemCard({ item }: { item: ItemWithRelations }) {
  const cover = item.images?.[0];

  return (
    <Link
      href={`/items/${item.id}`}
      className="focus-ring group glass block overflow-hidden rounded-2xl shadow-glass transition hover:-translate-y-1 hover:shadow-glass-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {cover ? (
          <Image
            src={cover}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">ไม่มีรูปภาพ</div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={item.status} />
        </div>
        {typeof item.favoritesCount === "number" && item.favoritesCount > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur">
            <Heart size={12} fill="currentColor" /> {item.favoritesCount}
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          <Tag size={10} /> {getCategoryLabel(item.category)}
        </span>
        <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-gray-50">{item.title}</h3>
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(item.date), "d MMM yyyy")}</span>
        </div>
        {item.contact ? (
          <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <MessageCircle size={11} className="shrink-0" /> <span className="truncate">ติดต่อ {item.contact}</span>
          </span>
        ) : null}
      </div>
    </Link>
  );
}
