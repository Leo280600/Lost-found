import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <PackageSearch size={40} className="text-gray-400" />
      <h1 className="font-[var(--font-display)] text-2xl font-bold">ไม่พบหน้านี้</h1>
      <p className="text-sm text-gray-500">หน้าที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่จริง</p>
      <Link href="/" className="focus-ring rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
