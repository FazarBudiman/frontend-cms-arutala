import z from "zod";

export const overviewSchema = z.object({
  messages: z.object({
    recent: z.array(
      z.object({
        message_id: z.string(),
        sender_name: z.string(),
        sender_email: z.string(),
        sender_phone: z.string(),
        subject: z.array(z.string()),
        created_date: z.string(),
      }),
    ),
    stats: z.array(
      z.object({
        month: z.string(),
        sort_key: z.string(),
        total: z.number(),
      }),
    ),
  }),
  courses: z.object({
    upcoming: z.array(
      z.object({
        course_id: z.string(),
        course_title: z.string(),
        course_batch_name: z.string(),
        course_batch_start_date: z.string(),
        course_batch_status: z.string(),
      }),
    ),
  }),
});

export type Overview = z.infer<typeof overviewSchema>;
