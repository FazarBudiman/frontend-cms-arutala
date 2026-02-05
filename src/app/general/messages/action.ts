// app/actions/messages.ts
"use server";

import { getAllMessages } from "@/lib/api/message.api";
import { messagesSchema } from "@/types/message";

export async function getAllMessagesAction() {
  const response = await getAllMessages();
  if (!response.success) {
    return {
      success: response.success,
      message: response.message,
      data: [],
    };
  }

  const parsed = messagesSchema.safeParse(response.data);

  if (!parsed.success) {
    return {
      success: false,
      statusCode: "500 INVALID_RESPONSE",
      message: "Invalid messages data structure",
    };
  }

  return {
    success: true,
    message: response.message,
    data: parsed.data,
  };
}
