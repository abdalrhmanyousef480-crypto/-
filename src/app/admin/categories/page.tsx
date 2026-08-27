import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CategoryRow } from "@/components/admin/CategoryRow";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { nameAr: "asc" },
    include: { _count: { select: { stores: true, coupons: true } } },
  });

  return (
    <div>
      <AdminPageHeader title="التصنيفات" newHref="/admin/categories/new" newLabel="إضافة تصنيف" />
      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>التصنيف</th>
              <th>المتاجر</th>
              <th>الكوبونات</th>
              <th>الحالة</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => <CategoryRow key={cat.id} category={cat} />)}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-center text-ink-muted py-10">لا توجد تصنيفات بعد.</p>}
      </div>
    </div>
  );
}
