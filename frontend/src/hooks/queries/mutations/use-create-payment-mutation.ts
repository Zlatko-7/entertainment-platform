import { createPayment, type CreatePaymentInput } from "@/api/payments";
import { useMutation } from "@tanstack/react-query";

export function useCreatePaymentMutation() {
  return useMutation({
    mutationFn: (input: CreatePaymentInput) => createPayment(input),
    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });
}
