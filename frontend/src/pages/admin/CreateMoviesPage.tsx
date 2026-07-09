import { authFetch } from "@/auth/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Movie } from "@/types/dashboard";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const emptyForm = {
  title: "",
  year: new Date().getFullYear().toString(),
  director: "",
  rating: "7",
  genre: "",
  cast: "",
  synopsis: "",
  posterUrl: "",
};

export default function CreateMoviesPage() {
  const [movieSubmitting, setMovieSubmitting] = useState(false);
  const [movieError, setMovieError] = useState<string | null>(null);
  const [movieSuccess, setMovieSuccess] = useState<string | null>(null);
  const [movieForm, setMovieForm] = useState(emptyForm);

  async function handleAddMovie(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMovieSubmitting(true);
    setMovieError(null);
    setMovieSuccess(null);

    try {
      const res = await authFetch(`${apiUrl}/api/add-movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: movieForm.title,
          year: Number(movieForm.year),
          director: movieForm.director,
          rating: Number(movieForm.rating),
          genre: movieForm.genre,
          cast: movieForm.cast
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean),
          synopsis: movieForm.synopsis,
          posterUrl: movieForm.posterUrl,
        }),
      });

      if (res.status === 403) {
        throw new Error("Only admins can add movies");
      }

      if (!res.ok) {
        throw new Error("Failed to add movie");
      }

      const created: Movie = await res.json();
      setMovieForm(emptyForm);
      setMovieSuccess(`"${created.title}" was added successfully.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add movie";
      setMovieError(message);
    } finally {
      setMovieSubmitting(false);
    }
  }

  return (
    <Card className="ring-0">
      <CardHeader>
        <CardTitle className="text-base">Add new movie</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create a new title for the catalog.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddMovie} className="grid gap-4 sm:grid-cols-2">
          {movieError ? (
            <p className="text-sm text-destructive sm:col-span-2" role="alert">
              {movieError}
            </p>
          ) : null}

          {movieSuccess ? (
            <p className="text-sm font-medium text-emerald-600 sm:col-span-2">
              {movieSuccess}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={movieForm.title}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              required
              value={movieForm.year}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, year: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="director">Director</Label>
            <Input
              id="director"
              required
              value={movieForm.director}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, director: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (0-10)</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              required
              value={movieForm.rating}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, rating: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              required
              value={movieForm.genre}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, genre: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cast">Cast (comma separated)</Label>
            <Input
              id="cast"
              required
              placeholder="Actor 1, Actor 2"
              value={movieForm.cast}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, cast: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="posterUrl">Poster URL</Label>
            <Input
              id="posterUrl"
              type="url"
              required
              value={movieForm.posterUrl}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, posterUrl: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <Input
              id="synopsis"
              required
              value={movieForm.synopsis}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, synopsis: e.target.value }))
              }
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={movieSubmitting}>
              {movieSubmitting ? "Saving..." : "Save movie"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
