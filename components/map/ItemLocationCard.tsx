"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ItemStatus } from "@/types";

const MiniMap = dynamic(() => import("./MiniMap").then((m) => m.MiniMap), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">กำลังโหลดแผนที่...</div>,
});

export function ItemLocationCard({
  latitude,
  longitude,
  status,
  location,
}: {
  latitude: number;
  longitude: number;
  status: ItemStatus;
  location: string;
}) {
  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
          <MapPin size={16} className="text-brand-500" /> ตำแหน่งบนแผนที่
        </h2>
        <Link href={`/map`} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
          ดูแผนที่รวม <ExternalLink size={12} />
        </Link>
      </div>
      <div className="h-56 overflow-hidden rounded-xl">
        <MiniMap latitude={latitude} longitude={longitude} status={status} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{location}</p>
    </Card>
  );
}
