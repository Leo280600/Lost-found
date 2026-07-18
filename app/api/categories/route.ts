import { ok } from "@/lib/api-response";
import { ITEM_CATEGORIES } from "@/lib/categories";

// Categories are a fixed, closed list (ItemCategory enum in prisma/schema.prisma),
// not a database table anymore. Kept as an API route so existing/future clients
// can still fetch the dropdown options without hardcoding them.
export async function GET() {
  return ok(ITEM_CATEGORIES);
}
