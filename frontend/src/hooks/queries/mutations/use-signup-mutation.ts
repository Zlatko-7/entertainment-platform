import { signup } from "@/api/auth";
import type { SignupFormData } from "@/lib/schemas/signup-schema";
import { useMutation } from "@tanstack/react-query";

export function useSignupMutation() {
  return useMutation({
    mutationFn: (data: SignupFormData) => signup(data),
  });
}
