import { ContributorTable } from "./component/contributor-table";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <ContributorTable />
      </div>
    </div>
  );
}
