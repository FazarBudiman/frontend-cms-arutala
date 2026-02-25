import { PageTable } from "@/features/seo-manage/page";

export default async function SeoManagePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <PageTable />
      </div>
    </div>
  );
}
