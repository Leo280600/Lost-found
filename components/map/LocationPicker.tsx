"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent, LeafletEvent, Marker as LeafletMarker } from "leaflet";
import { pickerIcon } from "@/lib/mapIcons";

const DEFAULT_CENTER: [number, number] = [18.8953, 99.0136]; // Maejo University fallback

function ClickToPlace({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const hasPin = latitude != null && longitude != null;
  const center = useMemo<[number, number]>(
    () => (hasPin ? [latitude as number, longitude as number] : DEFAULT_CENTER),
    // Intentionally not depending on lat/lng after first mount — recentering
    // on every pin move would fight the user's own pan/zoom while picking.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <MapContainer center={center} zoom={hasPin ? 16 : 15} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickToPlace onPick={onChange} />
      {hasPin && (
        <Marker
          position={[latitude as number, longitude as number]}
          icon={pickerIcon()}
          draggable
          eventHandlers={{
            dragend: (e: LeafletEvent) => {
              const marker = e.target as LeafletMarker;
              const pos = marker.getLatLng();
              onChange(pos.lat, pos.lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
