import { fetchMe } from "@/api/auth";
import { queryKeys } from "@/hooks/queries/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
