"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { statusIcon } from "@/lib/mapIcons";
import { StatusBadge } from "@/components/ui/Badge";
import { getCategoryLabel } from "@/lib/categories";
import type { MapItem } from "@/types";

const DEFAULT_CENTER: [number, number] = [18.8953, 99.0136]; // Maejo University, San Sai, Chiang Mai — used when there is nothing to center on yet

function FlyToItem({ item }: { item: MapItem | null }) {
  const map = useMap();
  useEffect(() => {
    if (item) {
      map.flyTo([item.latitude, item.longitude], Math.max(map.getZoom(), 17), { duration: 0.6 });
    }
  }, [item, map]);
  return null;
}

export function ItemsMap({
  items,
  focusedItem,
}: {
  items: MapItem[];
  focusedItem?: MapItem | null;
}) {
  const center = useMemo<[number, number]>(() => {
    if (items.length === 0) return DEFAULT_CENTER;
    const lat = items.reduce((sum, i) => sum + i.latitude, 0) / items.length;
    const lng = items.reduce((sum, i) => sum + i.longitude, 0) / items.length;
    return [lat, lng];
  }, [items]);

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToItem item={focusedItem ?? null} />

      {items.map((item) => (
        <Marker key={item.id} position={[item.latitude, item.longitude]} icon={statusIcon(item.status)}>
          <Popup minWidth={220} maxWidth={260}>
            <Link href={`/items/${item.id}`} className="block space-y-2 no-underline">
              <div className="relative h-28 w-full overflow-hidden rounded-lg bg-gray-100">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="220px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">ไม่มีรูปภาพ</div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="line-clamp-1 text-sm font-semibold text-gray-900">{item.title}</span>
                <StatusBadge status={item.status} />
              </div>
              <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                {getCategoryLabel(item.category)}
              </span>
              <div className="space-y-1 text-xs text-gray-500">
                <p className="flex items-center gap-1"><MapPin size={11} /> {item.location}</p>
                <p className="flex items-center gap-1"><Calendar size={11} /> {format(new Date(item.date), "d MMM yyyy")}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-brand-600">
                ดูรายละเอียด <ArrowRight size={12} />
              </span>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
