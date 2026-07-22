import { getPurchasedItems } from "@/api/purchases";
import { queryKeys } from "@/hooks/queries/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePurchasedItemsQuery() {
  return useQuery({
    queryKey: queryKeys.purchasedItems,
    queryFn: getPurchasedItems,
  });
}
