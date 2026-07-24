import AdminLayout from "@/components/layout/AdminLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CheckoutCancelPage from "@/pages/admin/CheckoutCancelPage";
import CreateMoviesPage from "@/pages/admin/CreateMoviesPage";
import OrdersHistoryPage from "@/pages/admin/OrdersHistoryPage";
import SubscriptionsPage from "@/pages/admin/SubscriptionsPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import LibraryPage from "@/pages/LibraryPage";
import MoviesPage from "@/pages/MoviesPage";
import MusicPage from "@/pages/MusicPage";
import NotFound from "@/pages/NotFound";
import { RouteUrls } from "@/routes/urls";
import { Navigate, Route, Routes } from "react-router";

export function PrivateRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path={RouteUrls.movie} element={<MoviesPage />} />
        <Route path={RouteUrls.music} element={<MusicPage />} />
        <Route path={RouteUrls.library} element={<LibraryPage />} />
        <Route
          path={RouteUrls.checkoutCancel}
          element={<CheckoutCancelPage />}
        />

        <Route path={RouteUrls.admin} element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to={RouteUrls.adminMovies} replace />}
          />
          <Route path={RouteUrls.adminMovies} element={<CreateMoviesPage />} />
          <Route path={RouteUrls.adminOrders} element={<OrdersHistoryPage />} />
          <Route
            path={RouteUrls.adminSubscriptions}
            element={<SubscriptionsPage />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={RouteUrls.movie} replace />} />
      <Route
        path={RouteUrls.checkoutSuccess}
        element={<CheckoutSuccessPage />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
