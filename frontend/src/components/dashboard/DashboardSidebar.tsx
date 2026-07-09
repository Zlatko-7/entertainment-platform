import { cn } from "@/lib/utils";
import { navItems } from "@/utils/dashboard";
import { NavLink } from "react-router";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-52 shrink-0 border-r border-border p-4 md:block">
      <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Menu
      </p>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
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
