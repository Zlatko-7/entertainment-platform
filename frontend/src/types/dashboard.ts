export type FilterOption = "all" | "popular" | "new" | "budget";

export interface DashboardOutletContext {
  searchQuery: string;
  activeFilter: FilterOption;
  onSelectMovie: (movie: Movie) => void;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  director: string;
  rating: number;
  genre: string;
  cast?: string[];
  actors?: string[];
  synopsis: string;
  posterUrl: string;
  price: number;
  // CURSOS LAST CHANGE: returned from API; Buy is enabled when this is set
  productId?: string | null;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  tag: string;
}
