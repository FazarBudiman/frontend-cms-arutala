import { clientApi } from "@/shared/lib/http/client-api";
import { User } from "@/features/user";

/**
 * Fetches all users from the API.
 * @returns A promise that resolves to an array of User objects.
 */
export async function fetchUsers(): Promise<User[]> {
  return await clientApi.get<User[]>("/api/users");
}

/* ---------- POST ---------- */
/**
 * Creates a new user using the provided form data.
 * @param formData - The form data containing user details and profile picture.
 */
export async function createUser(formData: FormData) {
  return clientApi.post("/api/users", formData);
}

/* ---------- DELETE ---------- */
/**
 * Deletes a user by their ID.
 * @param userId - The unique identifier of the user to delete.
 */
export async function deleteUser(userId: string) {
  return clientApi.delete(`/api/users/${userId}`);
}
