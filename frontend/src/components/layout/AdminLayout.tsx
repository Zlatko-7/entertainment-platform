import { useUser } from "@/auth/useAuth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ShieldAlert } from "lucide-react";
import { Outlet } from "react-router";

export default function AdminLayout() {
  const { user } = useUser();

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
        <ShieldAlert className="mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">Admin access required</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          You need an admin account to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-6 lg:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
