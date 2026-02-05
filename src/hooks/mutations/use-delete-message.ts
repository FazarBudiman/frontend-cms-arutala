// import { getAllMessagesAction } from "@/app/general/messages/action";
// // import { deleteMessageById } from "@/lib/api/message.api";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// export function UseDeleteMessage() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: getAllMessagesAction,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["messages"] });
//     },
//   });
// }
