// src/app/general/messages/query.ts
import { ApiResponse } from "@/types/api";
import { Message } from "@/types/message";

/* ---------- GET ---------- */
export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/messages", {
    credentials: "include",
    cache: "no-store",
  });

  const json: ApiResponse<Message[]> = await res.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data ?? [];
}

/* ---------- DELETE ---------- */
export async function deleteMessage(messageId: string): Promise<ApiResponse<null>> {
  const res = await fetch("/api/messages", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageId }),
  });

  return res.json();
}

/* ---------- PUT ---------- */
export async function updateMessageStatus(messageId: string, status: Message["message_status"]): Promise<ApiResponse<null>> {
  const res = await fetch("/api/messages", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageId, status }),
  });

  return res.json();
}
