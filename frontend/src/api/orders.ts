import { apiUrl, authFetch, parseJsonError } from "@/api/client";

export interface OrderMovie {
  posterUrl: string | null;
  year: number | null;
  genre: string | null;
  director: string | null;
}

export interface Order {
  id: string;
  productId: string;
  orderName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  invoiceUrl: string | null;
  movie: OrderMovie | null;
}

export async function getOrderHistory(): Promise<Order[]> {
  const res = await authFetch(`${apiUrl}/api/order-history`, {
    method: "GET",
  });

  if (!res.ok) {
    await parseJsonError(res, "Could not load your purchases");
  }

  const data = await res.json();
  return data.data ?? [];
}
