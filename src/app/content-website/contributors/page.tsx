import { ContributorTable } from "@/features/contributor";

export default async function ContributorPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <ContributorTable />
      </div>
    </div>
  );
}
