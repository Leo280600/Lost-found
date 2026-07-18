"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { statusIcon } from "@/lib/mapIcons";
import type { ItemStatus } from "@/types";

export function MiniMap({
  latitude,
  longitude,
  status,
}: {
  latitude: number;
  longitude: number;
  status: ItemStatus;
}) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={16} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={statusIcon(status)} />
    </MapContainer>
  );
}
