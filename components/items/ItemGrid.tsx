import type { ItemWithRelations } from "@/types";
import { ItemCard } from "./ItemCard";
import { ItemCardSkeleton } from "@/components/ui/Skeleton";
import { PackageSearch } from "lucide-react";

export function ItemGrid({ items, loading }: { items: ItemWithRelations[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ItemCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-16 text-center text-gray-500 dark:text-gray-400">
        <PackageSearch size={36} />
        <p className="font-medium">ไม่พบประกาศที่ตรงกับเงื่อนไข</p>
        <p className="text-sm">ลองปรับตัวกรองหรือคำค้นหาใหม่อีกครั้ง</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
