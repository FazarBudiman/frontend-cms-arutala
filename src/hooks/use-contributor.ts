import { fetchContributors } from "@/app/content-website/contributors/query";
import { Contributor } from "@/types/contributor";
import { useQuery } from "@tanstack/react-query";

export function useContributors() {
  return useQuery<Contributor[]>({
    queryKey: ["Contributors"],
    queryFn: fetchContributors,
  });
}
