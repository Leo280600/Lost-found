"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ItemFilters, type Filters } from "@/components/items/ItemFilters";
import { ItemGrid } from "@/components/items/ItemGrid";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import type { ItemWithRelations, PaginatedResult } from "@/types";
import { Search } from "lucide-react";

export function ItemsBrowser() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<Filters>({
    q: searchParams.get("q") ?? "",
    type: searchParams.get("type") ?? "",
    category: "",
    color: "",
    brand: "",
    location: "",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<ItemWithRelations> | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebounce(query, 350);
  const debouncedFilters = useDebounce(filters, 350);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, debouncedFilters]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (debouncedFilters.type) params.set("type", debouncedFilters.type);
    if (debouncedFilters.category) params.set("category", debouncedFilters.category);
    if (debouncedFilters.color) params.set("color", debouncedFilters.color);
    if (debouncedFilters.brand) params.set("brand", debouncedFilters.brand);
    if (debouncedFilters.location) params.set("location", debouncedFilters.location);
    params.set("sort", debouncedFilters.sort);
    params.set("page", String(page));
    params.set("limit", "12");

    const res = await fetch(`/api/items?${params.toString()}`);
    const json = await res.json();
    setResult(json.data);
    setLoading(false);
  }, [debouncedQuery, debouncedFilters, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">ค้นหาประกาศ</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">ค้นหาของหายและของที่พบแบบเรียลไทม์ พร้อมตัวกรองละเอียด</p>
      </div>

      <div className="glass flex items-center gap-2 rounded-full p-1.5 shadow-glass">
        <Search className="ml-3 shrink-0 text-gray-400" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาสิ่งของ, สถานที่, ยี่ห้อ..."
          className="focus-ring w-full bg-transparent px-1 py-2.5 text-sm placeholder:text-gray-400"
        />
      </div>

      <ItemFilters filters={filters} onChange={(next) => setFilters((f) => ({ ...f, ...next }))} />

      <ItemGrid items={result?.items ?? []} loading={loading} />

      {result && result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>ก่อนหน้า</Button>
          <span className="text-sm text-gray-500">หน้า {result.page} / {result.totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= result.totalPages} onClick={() => setPage((p) => p + 1)}>ถัดไป</Button>
        </div>
      )}
    </div>
  );
}
