import { getMovies, type MoviesParams } from "@/api/movies";
import { queryKeys } from "@/hooks/queries/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useMoviesQuery(params: MoviesParams) {
  return useQuery({
    queryKey: queryKeys.movies(params),
    queryFn: () => getMovies(params),
    placeholderData: keepPreviousData,
  });
}
