import type { Album, FilterOption, Movie } from "@/types/dashboard";
import { RouteUrls } from "@/routes/urls";
import { Film, Library, Music2 } from "lucide-react";

export const filterOptions: { id: FilterOption; label: string }[] = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "new", label: "New" },
  { id: "budget", label: "Under $10" },
];

export const navItems = [
  { path: RouteUrls.movie, label: "Movies", icon: Film },
  { path: RouteUrls.music, label: "Music", icon: Music2 },
  { path: RouteUrls.library, label: "Library", icon: Library },
];

export const albums: Album[] = [
  {
    id: 1,
    title: "Velvet Frequencies",
    artist: "Luna Vale",
    price: 9.99,
    tag: "popular",
  },
  {
    id: 2,
    title: "Afterglow Sessions",
    artist: "The Night Tides",
    price: 8.49,
    tag: "budget",
  },
  {
    id: 3,
    title: "Static Bloom",
    artist: "Echo Park",
    price: 10.99,
    tag: "new",
  },
  {
    id: 4,
    title: "Glass Cathedral",
    artist: "Mira Solis",
    price: 7.99,
    tag: "budget",
  },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getMovieCast(movie: Movie) {
  return movie.actors ?? movie.cast ?? [];
}

export function matchesMovieFilter(movie: Movie, filter: FilterOption) {
  if (filter === "all") return true;
  if (filter === "popular") return movie.rating >= 8;
  if (filter === "new") return movie.year >= new Date().getFullYear() - 1;
  if (filter === "budget") return movie.rating < 6;
  return true;
}

export function matchesAlbumFilter(price: number, tag: string, filter: FilterOption) {
  if (filter === "all") return true;
  if (filter === "budget") return price < 10;
  return tag === filter;
}
