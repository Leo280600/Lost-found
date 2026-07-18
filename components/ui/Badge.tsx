import { cn } from "@/lib/utils";
import type { ItemStatus } from "@/types";

const styles: Record<ItemStatus, string> = {
  LOST: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  FOUND: "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300",
  RETURNED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const labels: Record<ItemStatus, string> = {
  LOST: "ของหาย",
  FOUND: "พบของ",
  RETURNED: "คืนแล้ว",
};

export function StatusBadge({ status, className }: { status: ItemStatus; className?: string }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", styles[status], className)}>
      {labels[status]}
    </span>
  );
}
