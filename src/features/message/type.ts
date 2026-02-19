import { z } from "zod";

export const messageStatusEnum = z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "VERBAL_COMMITMENT", "CLOSED_WON", "CLOSED_LOSS", "ON_HOLD"]);

export const messageSchema = z.object({
  message_id: z.string(),
  sender_name: z.string(),
  sender_email: z.string(),
  sender_phone: z.string(),
  organization_name: z.string(),
  message_status: messageStatusEnum,
  subject: z.array(z.string()),
  message_body: z.string(),
  created_date: z.string(),
});

export type MessageStatus = z.infer<typeof messageStatusEnum>;
export type Message = z.infer<typeof messageSchema>;
export const messagesSchema = z.array(messageSchema);
