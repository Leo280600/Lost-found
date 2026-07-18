// Single source of truth for the fixed item-category list.
// Mirrors the `ItemCategory` enum in prisma/schema.prisma — keep both in sync.
// Category is used for filtering/searching only; item-specific details
// (brand, color, etc.) still live on the item itself.

export const ITEM_CATEGORIES = [
  {
    value: "ELECTRONICS",
    label: "อุปกรณ์อิเล็กทรอนิกส์",
    description: "โทรศัพท์ Laptop หูฟัง",
    icon: "smartphone",
  },
  {
    value: "BAG",
    label: "กระเป๋า",
    description: "กระเป๋าเรียน กระเป๋าสตางค์",
    icon: "briefcase",
  },
  {
    value: "DOCUMENT",
    label: "เอกสารและบัตร",
    description: "บัตรนักศึกษา บัตรประชาชน",
    icon: "id-card",
  },
  {
    value: "KEY",
    label: "กุญแจ",
    description: "กุญแจบ้าน กุญแจรถ Key Card",
    icon: "key",
  },
  {
    value: "PERSONAL_ITEM",
    label: "ของใช้ส่วนตัว",
    description: "แว่นตา นาฬิกา เครื่องประดับ",
    icon: "watch",
  },
  {
    value: "BOOK",
    label: "หนังสือและอุปกรณ์การเรียน",
    description: "หนังสือ สมุด อุปกรณ์การเรียน",
    icon: "book",
  },
  {
    value: "CLOTHING",
    label: "เสื้อผ้า",
    description: "เสื้อผ้า เครื่องแต่งกาย",
    icon: "shirt",
  },
  {
    value: "VEHICLE",
    label: "ยานพาหนะ",
    description: "จักรยาน หมวกกันน็อก อุปกรณ์ยานพาหนะ",
    icon: "bike",
  },
  {
    value: "FOOD_CONTAINER",
    label: "ภาชนะใส่อาหาร/น้ำ",
    description: "กล่องข้าว ขวดน้ำ แก้วน้ำ",
    icon: "utensils",
  },
  {
    value: "OTHER",
    label: "อื่น ๆ",
    description: "ไม่ตรงกับหมวดหมู่ข้างต้น",
    icon: "package",
  },
] as const;

export type ItemCategoryValue = (typeof ITEM_CATEGORIES)[number]["value"];

export const ITEM_CATEGORY_VALUES = ITEM_CATEGORIES.map((c) => c.value) as [
  ItemCategoryValue,
  ...ItemCategoryValue[],
];

const CATEGORY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  ITEM_CATEGORIES.map((c) => [c.value, c.label])
);

export function getCategoryLabel(value: string): string {
  return CATEGORY_LABEL_MAP[value] ?? value;
}
