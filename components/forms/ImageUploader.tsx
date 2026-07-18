"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

interface PendingUpload {
  id: string;
  previewUrl: string;
  progress: number; // 0-100
  status: "uploading" | "error";
  errorMessage?: string;
}

function uploadWithProgress(file: File, onProgress: (pct: number) => void) {
  return new Promise<{ url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let json: { success?: boolean; data?: { url: string }; message?: string } | null = null;
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        // ignore parse error, handled by status check below
      }
      if (xhr.status >= 200 && xhr.status < 300 && json?.data?.url) {
        resolve({ url: json.data.url });
      } else {
        reject(new Error(json?.message || "อัปโหลดรูปภาพไม่สำเร็จ"));
      }
    };

    xhr.onerror = () => reject(new Error("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่"));

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}

export function ImageUploader({
  images,
  onChange,
  max = 8,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const totalCount = images.length + pending.length;

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "รองรับเฉพาะไฟล์ JPG, JPEG, PNG หรือ WEBP เท่านั้น";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return "ขนาดไฟล์ต้องไม่เกิน 5MB";
    }
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    if (totalCount + incoming.length > max) {
      toast.error(`อัปโหลดได้สูงสุด ${max} รูป`);
      return;
    }

    for (const file of incoming) {
      const validationError = validateFile(file);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const previewUrl = URL.createObjectURL(file);

      if (validationError) {
        setPending((p) => [...p, { id, previewUrl, progress: 0, status: "error", errorMessage: validationError }]);
        toast.error(`${file.name}: ${validationError}`);
        continue;
      }

      setPending((p) => [...p, { id, previewUrl, progress: 0, status: "uploading" }]);

      uploadWithProgress(file, (pct) => {
        setPending((p) => p.map((item) => (item.id === id ? { ...item, progress: pct } : item)));
      })
        .then(({ url }) => {
          setPending((p) => p.filter((item) => item.id !== id));
          URL.revokeObjectURL(previewUrl);
          onChange([...images, url]);
        })
        .catch((err: Error) => {
          setPending((p) =>
            p.map((item) => (item.id === id ? { ...item, status: "error", errorMessage: err.message } : item))
          );
          toast.error(`${file.name}: ${err.message}`);
        });
    }
  };

  const removeUploadedImage = async (url: string) => {
    setDeletingUrl(url);
    // Remove optimistically so the UI feels instant; the storage cleanup runs in the background.
    onChange(images.filter((src) => src !== url));
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "ลบรูปภาพไม่สำเร็จ");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ลบรูปภาพไม่สำเร็จ");
    } finally {
      setDeletingUrl(null);
    }
  };

  const removePendingImage = (id: string) => {
    setPending((p) => {
      const target = p.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return p.filter((item) => item.id !== id);
    });
  };

  return (
    <div className="space-y-3">
      {(images.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((src) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeUploadedImage(src)}
                disabled={deletingUrl === src}
                className="focus-ring absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
                aria-label="ลบรูปภาพ"
              >
                {deletingUrl === src ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              </button>
            </div>
          ))}

          {pending.map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <Image src={item.previewUrl} alt="" fill sizes="120px" className="object-cover opacity-70" />
              <button
                type="button"
                onClick={() => removePendingImage(item.id)}
                className="focus-ring absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                aria-label="ยกเลิก"
              >
                <X size={14} />
              </button>
              {item.status === "uploading" ? (
                <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1.5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                    <div className="h-full bg-white transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                  <span className="mt-0.5 block text-center text-[10px] text-white">{item.progress}%</span>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-950/60 p-2 text-center">
                  <AlertCircle size={16} className="text-red-200" />
                  <span className="text-[10px] leading-tight text-red-100">{item.errorMessage}</span>
                </div>
              )}
            </div>
          ))}

          {totalCount < max && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="focus-ring flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-brand-400 hover:text-brand-500 dark:border-gray-700"
            >
              <ImagePlus size={20} />
              <span className="text-xs">เพิ่มรูป</span>
            </button>
          )}
        </div>
      )}

      {totalCount === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="focus-ring flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 py-8 text-gray-400 transition hover:border-brand-400 hover:text-brand-500 dark:border-gray-700"
        >
          <ImagePlus size={22} />
          <span className="text-xs">เพิ่มรูปภาพ</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="text-xs text-gray-400">
        รองรับไฟล์ JPG, JPEG, PNG, WEBP ขนาดไม่เกิน 5MB ต่อไฟล์ ({images.length + pending.filter((p) => p.status === "uploading").length}/{max})
      </p>
    </div>
  );
}
