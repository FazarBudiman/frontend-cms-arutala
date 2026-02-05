import z from "zod";

export const userSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  user_profile_url: z.string(),
  role_name: z.string(),
});

export type User = z.infer<typeof userSchema>;
export const usersSchema = z.array(userSchema);
