import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { apiClient } from "./client";

export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  return apiClient<User[]>("/users", {
    method: "GET",
  });
}
