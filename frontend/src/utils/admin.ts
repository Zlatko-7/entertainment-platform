import { Clapperboard, CreditCard, Receipt } from "lucide-react";
import { RouteUrls } from "@/routes/urls";

export const adminNavItems = [
  {
    path: RouteUrls.adminMovies,
    label: "Create movies",
    icon: Clapperboard,
  },
  {
    path: RouteUrls.adminOrders,
    label: "Orders history",
    icon: Receipt,
  },
  {
    path: RouteUrls.adminSubscriptions,
    label: "Subscriptions",
    icon: CreditCard,
  },
] as const;
