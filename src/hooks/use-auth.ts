import { fetchUserAuthenticated } from "@/app/sign-in/action";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function useAuthenticated() {
  return useQuery<User>({
    queryKey: ["authenticated-user"],
    queryFn: fetchUserAuthenticated,
    retry: false,
  });
}
