import AdminLayout from "@/components/dashboard/AdminLayout";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateMoviesPage from "@/pages/admin/CreateMoviesPage";
import OrdersHistoryPage from "@/pages/admin/OrdersHistoryPage";
import SubscriptionsPage from "@/pages/admin/SubscriptionsPage";
import LibraryPage from "@/pages/LibraryPage";
import Login from "@/pages/Login";
import MoviesPage from "@/pages/MoviesPage";
import MusicPage from "@/pages/MusicPage";
import SignUp from "@/pages/SignUp";
import { RouteUrls } from "@/routes/urls";
import { Navigate } from "react-router";
import { ReactElement } from "react";

export interface AppRoute {
  path: string;
  name: string;
  component: ReactElement;
}

export const PublicRoutes: AppRoute[] = [
  {
    path: RouteUrls.login,
    name: "Login",
    component: <Login />,
  },
  {
    path: RouteUrls.signup,
    name: "Sign Up",
    component: <SignUp />,
  },
];

export { RouteUrls } from "@/routes/urls";

export const DashboardLayoutRoute = {
  path: "/",
  element: <DashboardLayout />,
  children: [
    { path: "movie", element: <MoviesPage /> },
    { path: "music", element: <MusicPage /> },
    { path: "library", element: <LibraryPage /> },
    {
      path: "admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="movies" replace /> },
        { path: "movies", element: <CreateMoviesPage /> },
        { path: "orders", element: <OrdersHistoryPage /> },
        { path: "subscriptions", element: <SubscriptionsPage /> },
      ],
    },
  ],
};
