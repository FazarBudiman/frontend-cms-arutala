import { UserTable } from "@/features/user";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 lg:px-6">
        <UserTable />
      </div>
    </div>
  );
}
