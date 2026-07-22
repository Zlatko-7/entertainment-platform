import { login } from "@/api/auth";
import { queryKeys } from "@/hooks/queries/query-keys";
import type { LoginFormData } from "@/lib/schemas/login-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}
