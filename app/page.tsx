import Link from "next/link";
import { Search, PlusCircle, PackageCheck, PackageX, Users2, ShieldCheck, Sparkles, Map as MapIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ItemCard } from "@/components/items/ItemCard";
import type { ItemWithRelations } from "@/types";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [lostItems, foundItems, totalItems, totalUsers] = await Promise.all([
    prisma.item.findMany({
      where: { type: "LOST", status: "LOST" },
      include: { owner: { select: { id: true, name: true, avatarUrl: true, phone: true } }, _count: { select: { favorites: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.item.findMany({
      where: { type: "FOUND", status: "FOUND" },
      include: { owner: { select: { id: true, name: true, avatarUrl: true, phone: true } }, _count: { select: { favorites: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.item.count(),
    prisma.user.count(),
  ]);
  return { lostItems, foundItems, totalItems, totalUsers };
}

export default async function HomePage() {
  const { lostItems, foundItems, totalItems, totalUsers } = await getHomeData();
  const lost = lostItems as unknown as ItemWithRelations[];
  const found = foundItems as unknown as ItemWithRelations[];

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="glass relative flex flex-col items-center gap-6 rounded-3xl px-6 py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <Sparkles size={12} /> ระบบกลางแจ้งของหาย-ของพบในมหาวิทยาลัย
          </span>
          <h1 className="max-w-2xl font-[var(--font-display)] text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            หาของหาย <span className="text-brand-600">เจอเร็วขึ้น</span> ด้วย Lost &amp; Found Hub
          </h1>
          <p className="max-w-xl text-gray-600 dark:text-gray-300">
            แจ้งของหาย ประกาศของที่พบเจอ ค้นหาแบบเรียลไทม์ และขอรับของคืนได้อย่างปลอดภัย ตรวจสอบได้ทุกขั้นตอน
          </p>

          <form action="/items" className="glass flex w-full max-w-xl items-center gap-2 rounded-full p-1.5 shadow-glass-lg">
            <Search className="ml-3 shrink-0 text-gray-400" size={18} />
            <input
              name="q"
              placeholder="ค้นหาสิ่งของ, สถานที่, ยี่ห้อ..."
              className="focus-ring w-full bg-transparent px-1 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 dark:text-gray-100"
            />
            <button type="submit" className="focus-ring shrink-0 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
              ค้นหา
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/items/new" className="focus-ring flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
              <PlusCircle size={16} /> แจ้งประกาศใหม่
            </Link>
            <Link href="/items" className="focus-ring flex items-center gap-1.5 rounded-full bg-white/70 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-white dark:bg-white/10 dark:text-gray-100">
              ดูประกาศทั้งหมด
            </Link>
            <Link href="/map" className="focus-ring flex items-center gap-1.5 rounded-full bg-white/70 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-white dark:bg-white/10 dark:text-gray-100">
              <MapIcon size={16} /> ดูแผนที่
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<PackageX size={18} />} label="ของหาย" value={await prisma.item.count({ where: { status: "LOST" } })} />
        <StatCard icon={<PackageCheck size={18} />} label="พบของ" value={await prisma.item.count({ where: { status: "FOUND" } })} />
        <StatCard icon={<Users2 size={18} />} label="สมาชิก" value={totalUsers} />
        <StatCard icon={<ShieldCheck size={18} />} label="ประกาศทั้งหมด" value={totalItems} />
      </section>

      {/* Latest Lost */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">ของหายล่าสุด</h2>
          <Link href="/items?type=LOST" className="text-sm font-medium text-brand-600 hover:underline">ดูทั้งหมด</Link>
        </div>
        {lost.length === 0 ? (
          <p className="text-sm text-gray-500">ยังไม่มีประกาศของหาย</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lost.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        )}
      </section>

      {/* Latest Found */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">ของที่พบล่าสุด</h2>
          <Link href="/items?type=FOUND" className="text-sm font-medium text-brand-600 hover:underline">ดูทั้งหมด</Link>
        </div>
        {found.length === 0 ? (
          <p className="text-sm text-gray-500">ยังไม่มีประกาศของที่พบ</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {found.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass flex flex-col items-center gap-1 rounded-2xl px-4 py-6 text-center shadow-glass">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
        {icon}
      </div>
      <span className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}
