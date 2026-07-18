import L from "leaflet";
import type { ItemStatus } from "@/types";

// Bundlers break Leaflet's default marker image paths, so we build our own
// small SVG pin icons instead of relying on the default marker-icon.png.
// Colors mirror the StatusBadge palette used across the app.
const STATUS_COLORS: Record<ItemStatus, string> = {
  LOST: "#b45309", // amber-700
  FOUND: "#287044", // brand-600
  RETURNED: "#059669", // emerald-600
};

function pinSvg(color: string) {
  return `
    <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.716 23.284 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="6.5" fill="white"/>
    </svg>
  `;
}

const iconCache = new Map<string, L.DivIcon>();

export function statusIcon(status: ItemStatus): L.DivIcon {
  const cached = iconCache.get(status);
  if (cached) return cached;

  const icon = L.divIcon({
    className: "",
    html: pinSvg(STATUS_COLORS[status]),
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
  iconCache.set(status, icon);
  return icon;
}

let pickerIconInstance: L.DivIcon | null = null;

export function pickerIcon(): L.DivIcon {
  if (pickerIconInstance) return pickerIconInstance;
  pickerIconInstance = L.divIcon({
    className: "",
    html: pinSvg("#287044"),
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
  return pickerIconInstance;
}
