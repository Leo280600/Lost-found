import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Server-only Supabase client using the service role key — bypasses RLS,
// so this file must never be imported from client components.
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "item-images";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

let _client: SupabaseClient | null = null;
let _bucketEnsured = false;

function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. Set them in .env."
    );
  }

  _client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

// Creates the storage bucket if it doesn't already exist yet. Safe to call
// on every upload request — it only hits the network once per server instance.
async function ensureBucketExists(): Promise<void> {
  if (_bucketEnsured) return;
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase.storage.getBucket(STORAGE_BUCKET);
  if (!existing) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: MAX_IMAGE_SIZE_BYTES,
      allowedMimeTypes: [...ALLOWED_IMAGE_TYPES],
    });
    // Ignore "already exists" race between concurrent cold starts.
    if (error && !/already exists/i.test(error.message)) throw error;
  }
  _bucketEnsured = true;
}

function extensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export interface UploadedImage {
  url: string;
  path: string;
}

// Uploads one image buffer to Supabase Storage under a UUID filename so
// names never collide, scoped per-owner for easy ownership checks on delete.
export async function uploadImageToStorage(
  buffer: Buffer,
  mimeType: string,
  ownerId: string
): Promise<UploadedImage> {
  await ensureBucketExists();
  const supabase = getSupabaseAdmin();

  const ext = extensionFromMimeType(mimeType);
  const path = `items/${ownerId}/${randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buffer, {
    contentType: mimeType,
    upsert: false,
    cacheControl: "31536000",
  });
  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: publicUrlData.publicUrl, path };
}

// Extracts the storage object path from a Supabase public URL, e.g.
// https://xxxx.supabase.co/storage/v1/object/public/item-images/items/u1/abc.jpg
// -> items/u1/abc.jpg
export function getStoragePathFromUrl(url: string): string | null {
  const marker = `/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

// Deletes one or more images from storage by their public URL. Silently
// skips URLs that don't belong to our bucket (e.g. legacy external links)
// and never throws — image cleanup should never block the main operation.
export async function deleteImagesFromStorage(urls: string[]): Promise<void> {
  const paths = urls.map(getStoragePathFromUrl).filter((p): p is string => !!p);
  if (paths.length === 0) return;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    if (error) console.error("Supabase storage delete failed:", error.message);
  } catch (err) {
    console.error("Supabase storage delete failed:", err);
  }
}

// Ownership check used by the delete-single-image API route: a non-admin
// user may only delete files stored under their own owner folder.
export function isOwnedStoragePath(path: string, ownerId: string): boolean {
  return path.startsWith(`items/${ownerId}/`);
}
