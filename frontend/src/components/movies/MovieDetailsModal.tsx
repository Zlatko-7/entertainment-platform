import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/types/dashboard";
import { formatPrice, getMovieCast } from "@/lib/dashboard";
import { Star } from "lucide-react";

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export function MovieDetailsModal({ movie, onClose }: MovieDetailsModalProps) {
  if (!movie) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <Card
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl py-0 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute right-3 bottom-3 left-3">
            <CardTitle className="text-lg text-white">{movie.title}</CardTitle>
            <p className="text-sm text-white/80">
              {movie.year} • {movie.genre}
            </p>
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium tabular-nums">
                {movie.rating.toFixed(1)}
              </span>
            </div>
            <div className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              Directed by{" "}
              <span className="font-medium text-foreground">
                {movie.director}
              </span>
            </div>
            <div className="rounded-full bg-muted px-3 py-1 font-medium">
              {formatPrice(movie.price)}
            </div>
          </div>

          {getMovieCast(movie).length > 0 ? (
            <div>
              <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Cast
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">
                {getMovieCast(movie).join(", ")}
              </p>
            </div>
          ) : null}

          <div>
            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Synopsis
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {movie.synopsis}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
