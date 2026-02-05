import { getAllMessagesAction } from "./action";
import { MessageTable } from "@/components/messages/message-table";

export const dynamic = "force-dynamic";

export default async function Page() {
  const response = await getAllMessagesAction();
  if (!response.success) {
    return (
      <div className="p-6 text-red-500">
        <h2 className="font-semibold">Gagal mengambil pesan</h2>
        <p className="text-sm mt-2">{response.message}</p>
      </div>
    );
  }

  const messages = response.data || [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <MessageTable data={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}
