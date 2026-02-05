"use server";

import { getAllUsers } from "@/lib/api/user.api";
import { usersSchema } from "@/types/user";

export async function getAllUsersAction() {
  const response = await getAllUsers();
  if (!response.success) {
    return {
      success: response.success,
      message: response.message,
      data: [],
    };
  }

  const parsed = usersSchema.safeParse(response.data);

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
