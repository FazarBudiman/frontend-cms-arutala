import { deleteMessage, fetchMessages, updateMessageStatus } from "@/app/general/messages/query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/message";

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: ["Messages"],
    queryFn: fetchMessages,
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Messages"] });
    },
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, status }: { messageId: string; status: Message["message_status"] }) => updateMessageStatus(messageId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Messages"] });
    },
  });
}
