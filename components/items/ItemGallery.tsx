"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ItemGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        {hasImages ? (
          <Image src={images[active]} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">ไม่มีรูปภาพ</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={cn(
                "focus-ring relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2",
                i === active ? "border-brand-600" : "border-transparent opacity-70"
              )}
              aria-label={`รูปที่ ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
