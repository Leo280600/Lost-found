"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, X, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/Button";

const LocationPicker = dynamic(() => import("./LocationPicker").then((m) => m.LocationPicker), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">กำลังโหลดแผนที่...</div>
  ),
});

export function LocationField({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  onChange: (lat: number | null, lng: number | null) => void;
}) {
  const [locating, setLocating] = useState(false);
  const lat = latitude ?? null;
  const lng = longitude ?? null;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
          <MapPinned size={15} /> ปักหมุดตำแหน่งบนแผนที่ (ไม่บังคับ)
        </label>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="secondary" loading={locating} onClick={useCurrentLocation}>
            <LocateFixed size={14} /> ตำแหน่งปัจจุบัน
          </Button>
          {lat != null && lng != null && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null, null)}>
              <X size={14} /> ล้างหมุด
            </Button>
          )}
        </div>
      </div>

      <div className="h-64 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
        <LocationPicker
          latitude={lat}
          longitude={lng}
          onChange={(newLat, newLng) => onChange(newLat, newLng)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          step="any"
          placeholder="ละติจูด"
          value={lat ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value), lng)}
          className="focus-ring w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100"
        />
        <input
          type="number"
          step="any"
          placeholder="ลองจิจูด"
          value={lng ?? ""}
          onChange={(e) => onChange(lat, e.target.value === "" ? null : Number(e.target.value))}
          className="focus-ring w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100"
        />
      </div>
      <p className="text-xs text-gray-400">คลิกบนแผนที่หรือลากหมุดเพื่อกำหนดตำแหน่งที่แม่นยำขึ้น ระบบจะแสดงตำแหน่งนี้ในหน้าแผนที่รวม</p>
    </div>
  );
}
