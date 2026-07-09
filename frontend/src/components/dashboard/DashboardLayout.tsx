import { useUser } from "@/auth/useAuth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MovieDetailsModal } from "@/components/dashboard/MovieDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FilterOption, Movie } from "@/types/dashboard";
import { filterOptions, navItems } from "@/utils/dashboard";
import { LogOut, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { RouteUrls } from "@/routes/urls";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  async function handleLogout() {
    await logout();
    navigate(RouteUrls.login);
  }
  console.log(user, "user");
  return (
    <div className="fixed inset-0 z-10 flex flex-col bg-background">
      <header className="border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted">
              <Sparkles className="size-4 text-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              MediaStore
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "admin" ? (
              <Link
                to={RouteUrls.admin}
                className="inline-flex items-center rounded-lg border border-border bg-muted/20 px-3 py-1 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                Admin
              </Link>
            ) : null}
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.name ?? "Guest"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleLogout}
            >
              <LogOut className="size-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b border-border px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies and albums..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                type="button"
                size="sm"
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <DashboardSidebar />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-4 flex gap-2 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background hover:bg-muted"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <Outlet
            context={{
              searchQuery,
              activeFilter,
              onSelectMovie: setSelectedMovie,
            }}
          />
        </main>
      </div>

      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
