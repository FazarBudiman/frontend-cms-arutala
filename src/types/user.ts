import z from "zod";

export const userSchema = z.object({
  user_id: z.string(),
  full_name: z.string(),
  username: z.string(),
  user_profile_url: z.string(),
  role_name: z.string(),
});

export type User = z.infer<typeof userSchema>;
export const usersSchema = z.array(userSchema);

export const USER_ROLES = {
  ADMIN: "ADMIN",
  // SUPER_ADMIN: 'SUPER_ADMIN',
} as const;
const USERNAME_REGEX = /^[^\s]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S+$/;

export const createUserSchema = z
  .object({
    fullName: z.string().min(3, "Nama minimal 3 karakter"),

    username: z.string().min(8, "Username minimal 8 karakter").regex(USERNAME_REGEX, "Username tidak boleh mengandung spasi"),

    password: z.string().min(8, "Password minimal 8 karakter").regex(PASSWORD_REGEX, "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol"),

    confirmPassword: z.string().min(8),

    userRole: z.enum(Object.values(USER_ROLES) as [string, ...string[]]),

    profile: z
      .instanceof(File, { message: "Profile wajib diisi" })
      .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "File harus berupa JPG, PNG, atau WEBP")
      .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
