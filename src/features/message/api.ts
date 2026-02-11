import { Message } from "./type";
import { clientApi } from "@/shared/lib/http/client-api";

/* ---------- GET ---------- */
export async function fetchMessages(): Promise<Message[]> {
  return await clientApi.get<Message[]>("/api/messages");
}

/* ---------- DELETE ---------- */
export async function deleteMessage(messageId: string) {
  return clientApi.delete(`/api/messages/${messageId}`);
}

/* ---------- PUT ---------- */
export async function updateMessageStatus(messageId: string, status: Message["message_status"]) {
  return clientApi.put(`/api/messages/${messageId}`, JSON.stringify({ status }));
}
