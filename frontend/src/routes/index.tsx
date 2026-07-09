import { Navigate, Route, Routes as Switch, useLocation } from "react-router";
import {
  DashboardLayoutRoute,
  PublicRoutes,
  RouteUrls,
} from "./routes";
import { useUser } from "@/auth/useAuth";
import { ReactElement } from "react";

type DashboardChildRoute = {
  path?: string;
  index?: boolean;
  element: ReactElement;
  children?: DashboardChildRoute[];
};

function renderDashboardChildRoutes(children: DashboardChildRoute[]) {
  return children.map((child, index) => {
    const key = child.path ?? `index-${index}`;

    if (child.children) {
      return (
        <Route key={key} path={child.path} element={child.element}>
          {renderDashboardChildRoutes(child.children)}
        </Route>
      );
    }

    if (child.index) {
      return <Route key={key} index element={child.element} />;
    }

    return (
      <Route key={key} path={child.path} element={child.element} />
    );
  });
}

export default function Routes() {
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

  if (user) {
    return (
      <Switch>
        <Route path={DashboardLayoutRoute.path} element={DashboardLayoutRoute.element}>
          <Route
            index
            element={<Navigate to={RouteUrls.movie} replace />}
          />
          {renderDashboardChildRoutes(DashboardLayoutRoute.children)}
        </Route>
        <Route path="*" element={<Navigate to={RouteUrls.movie} replace />} />
      </Switch>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Switch>
        {PublicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<Navigate to={RouteUrls.login} replace />} />
      </Switch>
    </div>
  );
}
