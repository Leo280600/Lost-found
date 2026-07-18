import { Suspense } from "react";
import { ItemsBrowser } from "./ItemsBrowser";

export default function ItemsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">กำลังโหลด...</div>}>
      <ItemsBrowser />
    </Suspense>
  );
}
