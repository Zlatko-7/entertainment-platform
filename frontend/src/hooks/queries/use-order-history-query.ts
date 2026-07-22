import { getOrderHistory } from "@/api/orders";
import { queryKeys } from "@/hooks/queries/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useOrderHistoryQuery() {
  return useQuery({
    queryKey: queryKeys.orderHistory,
    queryFn: getOrderHistory,
  });
}
