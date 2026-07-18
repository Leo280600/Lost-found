import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { z } from "zod";
import { ITEM_CATEGORY_VALUES } from "@/lib/categories";
import type { Prisma } from "@prisma/client";
import type { MapItem } from "@/types";

// Small, purpose-built query: only items that have coordinates, and only
// the fields the map/marker/card UI actually needs. Keeps the payload light
// even once there are hundreds of pinned items.
const mapQuerySchema = z.object({
  type: z.enum(["LOST", "FOUND"]).optional(),
  status: z.enum(["LOST", "FOUND", "RETURNED"]).optional(),
  category: z.enum(ITEM_CATEGORY_VALUES).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = mapQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return fail("พารามิเตอร์ค้นหาไม่ถูกต้อง", 422, parsed.error.flatten());

  const { type, status, category } = parsed.data;

  const where: Prisma.ItemWhereInput = {
    latitude: { not: null },
    longitude: { not: null },
    ...(type && { type }),
    ...(status && { status }),
    ...(category && { category }),
  };

  const items = await prisma.item.findMany({
    where,
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      category: true,
      location: true,
      latitude: true,
      longitude: true,
      images: true,
      date: true,
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const mapItems: MapItem[] = items.map((i) => ({
    id: i.id,
    title: i.title,
    type: i.type,
    status: i.status,
    category: i.category,
    location: i.location,
    latitude: i.latitude as number,
    longitude: i.longitude as number,
    image: i.images[0] ?? null,
    date: i.date.toISOString(),
  }));

  return ok(mapItems);
}
