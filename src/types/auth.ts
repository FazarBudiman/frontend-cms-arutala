import z from "zod";

const USERNAME_REGEX = /^[^\s]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S+$/;

export const signInSchema = z.object({
  username: z.string().min(8, "Username minimal 8 karakter").regex(USERNAME_REGEX, "Username tidak boleh mengandung spasi"),
  password: z.string().min(8, "Password minimal 8 karakter").regex(PASSWORD_REGEX, "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol"),
});

export type SignInInput = z.infer<typeof signInSchema>;
