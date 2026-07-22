import { apiUrl, authFetch } from "@/api/client";

export interface CreatePaymentInput {
  movieId?: string;
  productId?: string;
}

export interface CreatePaymentResponse {
  url: string;
}

export async function createPayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResponse> {
  const res = await authFetch(`${apiUrl}/api/stripe/create-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      input.movieId ? { movieId: input.movieId } : { productId: input.productId }
    ),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? "Payment setup failed");
  }

  if (typeof data.url !== "string" || !data.url) {
    throw new Error("Checkout URL was not returned by the server.");
  }

  return data;
}
