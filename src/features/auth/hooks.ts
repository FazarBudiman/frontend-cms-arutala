import { User } from "@/features/user/type";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAuthenticated } from "./api";

export function useAuthenticated() {
  return useQuery<User>({
    queryKey: ["authenticated-user"],
    queryFn: fetchUserAuthenticated,
    retry: false,
  });
}
