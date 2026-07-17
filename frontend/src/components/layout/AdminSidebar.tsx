import { cn } from "@/lib/utils";
import { adminNavItems } from "@/lib/admin";
import { NavLink } from "react-router";

export function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 lg:w-52">
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage catalog and billing.
        </p>
      </div>

      <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )
              }
            >
              <Icon className="size-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
