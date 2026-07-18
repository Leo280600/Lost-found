"use client";

import { useState } from "react";
import { Heart, Share2, HandHeart, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ClaimForm } from "@/components/forms/ClaimForm";
import { useAuth } from "@/hooks/useAuth";
import type { ItemWithRelations } from "@/types";

export function ItemActions({ item }: { item: ItemWithRelations }) {
  const { user } = useAuth();
  const router = useRouter();
  const [favorited, setFavorited] = useState(!!item.isFavorited);
  const [favCount, setFavCount] = useState(item.favoritesCount ?? 0);
  const [claimOpen, setClaimOpen] = useState(false);

  const isOwner = user?.id === item.ownerId;

  const toggleFavorite = async () => {
    if (!user) return router.push("/login");
    const res = await fetch(`/api/items/${item.id}/favorite`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) return toast.error(json.message ?? "ทำรายการไม่สำเร็จ");
    setFavorited(json.data.favorited);
    setFavCount((c) => c + (json.data.favorited ? 1 : -1));
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: item.title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("คัดลอกลิงก์แล้ว");
    }
  };

  const remove = async () => {
    if (!confirm("ยืนยันการลบประกาศนี้?")) return;
    const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("ลบไม่สำเร็จ");
    toast.success("ลบประกาศสำเร็จ");
    router.push("/items");
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {!isOwner && item.status !== "RETURNED" && (
          <Button onClick={() => (user ? setClaimOpen(true) : router.push("/login"))} className="flex-1 sm:flex-none">
            <HandHeart size={16} /> ขอรับของคืน
          </Button>
        )}
        <Button variant="secondary" onClick={toggleFavorite}>
          <Heart size={16} fill={favorited ? "currentColor" : "none"} className={favorited ? "text-red-500" : ""} /> {favCount}
        </Button>
        <Button variant="secondary" onClick={share}>
          <Share2 size={16} /> แชร์
        </Button>
        {isOwner && (
          <>
            <Button variant="secondary" onClick={() => router.push(`/items/${item.id}/edit`)}>
              <Pencil size={16} /> แก้ไข
            </Button>
            <Button variant="danger" onClick={remove}>
              <Trash2 size={16} /> ลบ
            </Button>
          </>
        )}
      </div>

      {claimOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setClaimOpen(false)}>
          <div className="glass w-full max-w-md rounded-2xl p-6 shadow-glass-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-[var(--font-display)] text-lg font-bold">ขอรับของคืน</h3>
            <ClaimForm itemId={item.id} onSuccess={() => setClaimOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
