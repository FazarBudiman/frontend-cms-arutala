import { apiClient } from "./client";
import { Message } from "@/types/message";
import { ApiResponse } from "@/types/api";

export async function getAllMessages(): Promise<ApiResponse<Message[]>> {
  return apiClient<Message[]>("/messages", {
    method: "GET",
  });
}

export async function deleteMessageById(id: string): Promise<ApiResponse<null>> {
  return apiClient(`/messages/${id}`, {
    method: "DELETE",
  });
}
