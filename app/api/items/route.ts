import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { itemSchema, itemQuerySchema } from "@/lib/validations";
import { ok, created, fail, unauthorized } from "@/lib/api-response";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = itemQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return fail("พารามิเตอร์ค้นหาไม่ถูกต้อง", 422, parsed.error.flatten());

  const { q, type, status, category, color, brand, location, sort, page, limit } = parsed.data;

  const where: Prisma.ItemWhereInput = {
    ...(type && { type }),
    ...(status && { status }),
    ...(category && { category }),
    ...(color && { color: { contains: color, mode: "insensitive" } }),
    ...(brand && { brand: { contains: brand, mode: "insensitive" } }),
    ...(location && { location: { contains: location, mode: "insensitive" } }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ],
    }),
  };

  const [total, items] = await Promise.all([
    prisma.item.count({ where }),
    prisma.item.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true, phone: true } },
        _count: { select: { favorites: true } },
      },
      orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return ok({
    items: items.map((i) => ({ ...i, favoritesCount: i._count.favorites })),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return unauthorized();

  const body = await req.json().catch(() => null);
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) return fail("ข้อมูลไม่ถูกต้อง", 422, parsed.error.flatten());

  const data = parsed.data;
  const item = await prisma.item.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      status: data.type,
      color: data.color ?? undefined,
      brand: data.brand ?? undefined,
      contact: data.contact ?? undefined,
      location: data.location,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      date: data.date,
      images: data.images,
      category: data.category,
      ownerId: auth.userId,
    },
    include: { owner: { select: { id: true, name: true, avatarUrl: true, phone: true } } },
  });

  return created(item);
}
