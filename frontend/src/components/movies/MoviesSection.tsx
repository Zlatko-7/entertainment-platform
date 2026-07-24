import { MoviesPagination } from "@/components/movies/MoviesPagination";
import CheckoutWrapper from "@/components/stripe/CheckoutWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useMoviesQuery } from "@/hooks/queries/use-movies-query";
import { usePurchasedItemsQuery } from "@/hooks/queries/use-purchased-items-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatPrice } from "@/lib/dashboard";
import type { FilterOption, Movie } from "@/types/dashboard";
import { Info, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface MoviesSectionProps {
  searchQuery: string;
  activeFilter: FilterOption;
  onSelectMovie: (movie: Movie) => void;
}

const MOVIES_PER_PAGE = 12;

export function MoviesSection({
  searchQuery,
  activeFilter,
  onSelectMovie,
}: MoviesSectionProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutMovie, setCheckoutMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const {
    data: moviesData,
    isPending: moviesLoading,
    isError: moviesError,
    error: moviesQueryError,
  } = useMoviesQuery({
    page,
    limit: MOVIES_PER_PAGE,
    search: debouncedSearch,
    filter: activeFilter,
  });

  const { data: purchasedItems = [], isError: purchasedItemsError } =
    usePurchasedItemsQuery();

  const movies = moviesData?.data ?? [];
  const totalPages = moviesData?.pagination?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeFilter]);

  useEffect(() => {
    if (!moviesError || !moviesQueryError) return;

    toast.error(
      moviesQueryError instanceof Error
        ? moviesQueryError.message
        : "Failed to load movies. Please try again."
    );
  }, [moviesError, moviesQueryError]);

  useEffect(() => {
    if (!purchasedItemsError) return;

    toast.error("Failed to load your purchases. Please try again.");
  }, [purchasedItemsError]);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Movies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and buy digital media.
        </p>
      </div>

      {moviesLoading ? (
        <p className="text-sm text-muted-foreground">Loading movies...</p>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {movies.map((movie) => {
            const isPurchased = !!movie.productId
              ? purchasedItems.includes(movie.productId)
              : false;
            return (
              <Card
                key={movie.id}
                className="group relative w-full overflow-hidden rounded-3xl border border-border/50 bg-card py-0 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-border hover:shadow-[0_12px_40px_rgba(0,0,0,0.12),0_32px_80px_rgba(0,0,0,0.1)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-amber-500/0 via-transparent to-foreground/0 opacity-0 transition-opacity duration-500 group-hover:from-amber-500/10 group-hover:to-foreground/5 group-hover:opacity-100"
                />

                <div className="relative aspect-[2/2.55] overflow-hidden bg-muted">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/5" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div
                    aria-hidden
                    className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                  />

                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div className="absolute top-3 right-3 left-3 flex items-start justify-between gap-2">
                    <span className="rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-white/90 uppercase backdrop-blur-md">
                      {movie.year}
                    </span>
                    <span className="max-w-[58%] truncate rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md">
                      {movie.genre.split(",")[0]?.trim()}
                    </span>
                  </div>

                  <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full border border-amber-300/25 bg-black/55 px-2.5 py-1 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-50 tabular-nums">
                      {movie.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="absolute right-3 bottom-14 left-3">
                    <CardTitle className="line-clamp-2 text-base leading-snug font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                      {movie.title}
                    </CardTitle>
                  </div>
                </div>

                <div className="relative space-y-3 p-3">
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    Directed by{" "}
                    <span className="font-medium text-foreground/80">
                      {movie.director}
                    </span>
                  </p>

                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                        Own it for
                      </p>
                      <p className="text-xl font-bold tracking-tight text-foreground tabular-nums">
                        {formatPrice(movie.price)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 rounded-xl"
                      onClick={() => onSelectMovie(movie)}
                    >
                      <Info className="size-3.5" />
                      Details
                    </Button>

                    {!isPurchased ? (
                      <Button
                        type="button"
                        size="sm"
                        className="h-9 gap-1.5 rounded-xl bg-foreground px-3 text-background shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-foreground/90 hover:shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
                        onClick={() => {
                          if (!movie.productId) return;
                          setCheckoutMovie(movie);
                          setShowCheckout(true);
                        }}
                        disabled={!movie.productId}
                      >
                        <ShoppingBag className="size-3.5" />
                        Buy
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        disabled
                        className="h-9 rounded-xl bg-muted/50 px-3 text-foreground/70 shadow-none ring-1 ring-border/60 cursor-not-allowed"
                      >
                        Purchased
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {!moviesLoading ? (
        <MoviesPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}

      {showCheckout && checkoutMovie ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            setShowCheckout(false);
            setCheckoutMovie(null);
          }}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <CheckoutWrapper
              movieId={checkoutMovie.id}
              title={`Buy ${checkoutMovie.title}`}
              onClose={() => {
                setShowCheckout(false);
                setCheckoutMovie(null);
              }}
            />
          </div>
        </div>
      ) : null}

      {!moviesLoading && movies.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No movies match your search.
        </p>
      ) : null}
    </>
  );
}
