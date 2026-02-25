import { MessageTable } from "@/features/message";

export default async function MessagePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6">
        <MessageTable />
      </div>
    </div>
  );
}
