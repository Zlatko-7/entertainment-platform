import { useUser } from "@/auth/useAuth";
import { PrivateRoutes } from "@/routes/private-routes";
import { PublicRoutes } from "@/routes/public-routes";
import { RouteUrls } from "@/routes/urls";
import { Navigate, useLocation } from "react-router";

export default function AppRoutes() {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (
    user &&
    (location.pathname === RouteUrls.login ||
      location.pathname === RouteUrls.signup)
  ) {
    return <Navigate to={RouteUrls.movie} replace />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <PublicRoutes />
      </div>
    );
  }

  return <PrivateRoutes />;
}
