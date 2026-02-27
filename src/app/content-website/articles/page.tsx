import { ArticleTable } from "@/features/article";

export default async function ArticlePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <ArticleTable />
      </div>
    </div>
  );
}
