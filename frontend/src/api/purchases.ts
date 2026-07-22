import { apiUrl, authFetch, parseJsonError } from "@/api/client";

export interface PurchasedItemsResponse {
  purchasedProducts: string[];
}

export async function getPurchasedItems(): Promise<string[]> {
  const res = await authFetch(`${apiUrl}/api/purchased-items`, {
    method: "GET",
  });

  if (!res.ok) {
    await parseJsonError(res, "Failed to load purchased items");
  }

  const data: PurchasedItemsResponse = await res.json();
  return Array.isArray(data.purchasedProducts) ? data.purchasedProducts : [];
}
