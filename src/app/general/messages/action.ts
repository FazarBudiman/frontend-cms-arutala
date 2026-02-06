import { ApiResponse } from "@/types/api";
import { Message } from "@/types/message";

export async function getAllMessagesAction(): Promise<ApiResponse<Message[]>> {
  const res = await fetch(`/api/messages`, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  return res.json();
}

export async function deleteMessageByIdAction(messageId: string): Promise<ApiResponse<null>> {
  const res = await fetch(`/api/messages`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageId }),
    credentials: "include",
  });

  return res.json();
}
