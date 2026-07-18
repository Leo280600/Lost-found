import { ItemForm } from "@/components/forms/ItemForm";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-gray-900 dark:text-white">แจ้งประกาศใหม่</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">กรอกรายละเอียดของหายหรือของที่พบให้ครบถ้วนเพื่อเพิ่มโอกาสได้คืน</p>
      </div>
      <Card className="p-6 sm:p-8">
        <ItemForm />
      </Card>
    </div>
  );
}
