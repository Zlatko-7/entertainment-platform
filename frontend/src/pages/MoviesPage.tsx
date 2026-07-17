import { MoviesSection } from "@/components/movies/MoviesSection";
import type { DashboardOutletContext } from "@/types/dashboard";
import { useOutletContext } from "react-router";

export default function MoviesPage() {
  const { searchQuery, activeFilter, onSelectMovie } =
    useOutletContext<DashboardOutletContext>();

  return (
    <MoviesSection
      searchQuery={searchQuery}
      activeFilter={activeFilter}
      onSelectMovie={onSelectMovie}
    />
  );
}
