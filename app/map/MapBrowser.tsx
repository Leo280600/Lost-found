"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Map as MapIcon, PackageSearch } from "lucide-react";
import { format } from "date-fns";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/Badge";
import { getCategoryLabel, ITEM_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { MapItem } from "@/types";

// Leaflet touches `window`, so the map itself can only ever render on the
// client — load it lazily and skip server rendering entirely.
const ItemsMap = dynamic(() => import("@/components/map/ItemsMap").then((m) => m.ItemsMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">กำลังโหลดแผนที่...</div>
  ),
});

export function MapBrowser() {
  const [items, setItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [focusedItem, setFocusedItem] = useState<MapItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (category) params.set("category", category);
      const res = await fetch(`/api/items/map?${params.toString()}`);
      const json = await res.json();
      setItems(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [type, category]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">
            <MapIcon size={22} className="text-brand-600" /> แผนที่ประกาศ
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ดูตำแหน่งของหายและของที่พบบนแผนที่ กดที่หมุดเพื่อดูรายละเอียดสิ่งของ
          </p>
        </div>
      </div>

      <div className="glass grid grid-cols-2 gap-3 rounded-2xl p-4 sm:grid-cols-3 lg:grid-cols-4">
        <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="ประเภทประกาศ">
          <option value="">ทุกประเภท</option>
          <option value="LOST">ของหาย</option>
          <option value="FOUND">พบของ</option>
        </Select>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="หมวดหมู่">
          <option value="">ทุกหมวดหมู่</option>
          {ITEM_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
        <div className="col-span-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 sm:col-span-1 lg:col-span-2 lg:justify-end">
          {!loading && <span>{items.length.toLocaleString()} รายการที่ระบุพิกัด</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="glass h-[420px] overflow-hidden rounded-2xl shadow-glass sm:h-[520px] lg:col-span-3">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">กำลังโหลดแผนที่...</div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-500 dark:text-gray-400">
              <PackageSearch size={32} />
              <p className="text-sm">ยังไม่มีประกาศที่ระบุพิกัดตรงกับตัวกรองนี้</p>
            </div>
          ) : (
            <ItemsMap items={items} focusedItem={focusedItem} />
          )}
        </div>

        <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1 sm:max-h-[520px] lg:col-span-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass h-24 animate-pulse rounded-2xl" />
            ))
          ) : items.length === 0 ? (
            <p className="px-1 text-sm text-gray-500 dark:text-gray-400">ไม่มีรายการให้แสดง</p>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                onClick={() => setFocusedItem(item)}
                className={cn(
                  "focus-ring glass flex w-full items-center gap-3 rounded-2xl p-3 text-left shadow-glass transition hover:-translate-y-0.5 hover:shadow-glass-lg",
                  focusedItem?.id === item.id && "ring-2 ring-brand-500"
                )}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-gray-400">ไม่มีรูป</div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-50">{item.title}</span>
                    <StatusBadge status={item.status} className="shrink-0" />
                  </div>
                  <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {getCategoryLabel(item.category)}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {item.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {format(new Date(item.date), "d MMM yyyy")}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        ต้องการดูแบบละเอียด? <Link href="/items" className="font-medium text-brand-600 hover:underline">ไปหน้าค้นหาประกาศ</Link>
      </p>
    </div>
  );
}
