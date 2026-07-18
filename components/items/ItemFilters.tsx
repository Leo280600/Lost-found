"use client";

import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { ITEM_CATEGORIES } from "@/lib/categories";

export interface Filters {
  q: string;
  type: string;
  category: string;
  color: string;
  brand: string;
  location: string;
  sort: string;
}

export function ItemFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}) {
  return (
    <div className="glass grid grid-cols-2 gap-3 rounded-2xl p-4 sm:grid-cols-3 lg:grid-cols-6">
      <Select value={filters.type} onChange={(e) => onChange({ type: e.target.value })} aria-label="ประเภทประกาศ">
        <option value="">ทุกประเภท</option>
        <option value="LOST">ของหาย</option>
        <option value="FOUND">พบของ</option>
      </Select>

      <Select value={filters.category} onChange={(e) => onChange({ category: e.target.value })} aria-label="หมวดหมู่">
        <option value="">ทุกหมวดหมู่</option>
        {ITEM_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </Select>

      <Input placeholder="สี" value={filters.color} onChange={(e) => onChange({ color: e.target.value })} aria-label="สี" />
      <Input placeholder="ยี่ห้อ" value={filters.brand} onChange={(e) => onChange({ brand: e.target.value })} aria-label="ยี่ห้อ" />
      <Input placeholder="สถานที่" value={filters.location} onChange={(e) => onChange({ location: e.target.value })} aria-label="สถานที่" />

      <Select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })} aria-label="เรียงลำดับ">
        <option value="newest">ล่าสุดก่อน</option>
        <option value="oldest">เก่าสุดก่อน</option>
      </Select>
    </div>
  );
}
