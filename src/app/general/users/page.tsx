import { UserTable } from "@/features/user";

export default async function UserPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <UserTable />
      </div>
    </div>
  );
}
