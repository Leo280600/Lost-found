import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200/60 py-10 text-sm text-gray-500 dark:border-gray-800/60 dark:text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <p>© {new Date().getFullYear()} Lost &amp; Found Hub — ระบบประกาศของหายภายในมหาวิทยาลัยแม่โจ้</p>
        <div className="flex gap-4">
          <Link href="/items" className="hover:text-brand-600">ค้นหาประกาศ</Link>
          <Link href="/items/new" className="hover:text-brand-600">แจ้งประกาศ</Link>
        </div>
      </div>
    </footer>
  );
}
