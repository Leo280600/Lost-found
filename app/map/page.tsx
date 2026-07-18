import { Suspense } from "react";
import { MapBrowser } from "./MapBrowser";

export default function MapPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">กำลังโหลด...</div>}>
      <MapBrowser />
    </Suspense>
  );
}
