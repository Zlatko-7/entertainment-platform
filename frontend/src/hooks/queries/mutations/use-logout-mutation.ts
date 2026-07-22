import { logout } from "@/api/auth";
import { queryKeys } from "@/hooks/queries/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.setQueryData(queryKeys.me, null);
      queryClient.removeQueries();
    },
  });
}
