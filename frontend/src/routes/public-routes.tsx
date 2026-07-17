import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import { RouteUrls } from "@/routes/urls";
import { Navigate, Route, Routes } from "react-router";

export function PublicRoutes() {
  return (
    <Routes>
      <Route path={RouteUrls.login} element={<Login />} />
      <Route path={RouteUrls.signup} element={<SignUp />} />
      <Route path="*" element={<Navigate to={RouteUrls.login} replace />} />
    </Routes>
  );
}
