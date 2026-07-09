import { MusicSection } from "@/components/dashboard/MusicSection";
import type { DashboardOutletContext } from "@/types/dashboard";
import { useOutletContext } from "react-router";

export default function MusicPage() {
  const { searchQuery, activeFilter } =
    useOutletContext<DashboardOutletContext>();

  return (
    <MusicSection searchQuery={searchQuery} activeFilter={activeFilter} />
  );
}
