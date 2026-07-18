import type { ItemCategoryValue } from "@/lib/categories";

export type Role = "USER" | "ADMIN";
export type ItemType = "LOST" | "FOUND";
export type ItemStatus = "LOST" | "FOUND" | "RETURNED";
export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED";
export type NotificationType = "CLAIM_REQUESTED" | "CLAIM_APPROVED" | "CLAIM_REJECTED" | "ITEM_RETURNED";
export type ItemCategory = ItemCategoryValue;

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  faculty: string | null;
  studentId: string | null;
  avatarUrl: string | null;
  role: Role;
  isBanned: boolean;
  createdAt: string;
}

export interface ItemWithRelations {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  status: ItemStatus;
  color: string | null;
  brand: string | null;
  contact: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  images: string[];
  category: ItemCategory;
  ownerId: string;
  owner: Pick<PublicUser, "id" | "name" | "avatarUrl" | "phone">;
  favoritesCount?: number;
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MapItem {
  id: string;
  title: string;
  type: ItemType;
  status: ItemStatus;
  category: ItemCategory;
  location: string;
  latitude: number;
  longitude: number;
  image: string | null;
  date: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
}
