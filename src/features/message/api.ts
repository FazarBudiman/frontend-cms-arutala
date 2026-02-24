import { Message } from "./type";
import { clientApi } from "@/shared/lib/http/client-api";

/**
 * Fetches all messages from the API.
 * @returns A promise that resolves to an array of Message objects.
 */
export async function fetchMessages(): Promise<Message[]> {
  return await clientApi.get<Message[]>("/api/messages");
}

/* ---------- DELETE ---------- */
/**
 * Deletes a message by its ID.
 * @param messageId - The unique identifier of the message to delete.
 */
export async function deleteMessage(messageId: string) {
  return clientApi.delete(`/api/messages/${messageId}`);
}

/* ---------- PUT ---------- */
/**
 * Updates the status of a specific message.
 * @param messageId - The unique identifier of the message.
 * @param status - The new status to be applied to the message.
 */
export async function updateMessageStatus(messageId: string, status: Message["message_status"]) {
  return clientApi.put(`/api/messages/${messageId}`, JSON.stringify({ status }));
}
