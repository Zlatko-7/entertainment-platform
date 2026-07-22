import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMovieMutation } from "@/hooks/queries/mutations/use-create-movie-mutation";
import { useState } from "react";
import { toast } from "react-toastify";

const emptyForm = {
  title: "",
  year: new Date().getFullYear().toString(),
  director: "",
  rating: "7",
  genre: "",
  cast: "",
  synopsis: "",
  price: "9.99",
  poster: null as File | null,
};

export default function CreateMoviesPage() {
  const [movieSuccess, setMovieSuccess] = useState<string | null>(null);
  const [movieForm, setMovieForm] = useState(emptyForm);
  const [formKey, setFormKey] = useState(0);
  const createMovieMutation = useCreateMovieMutation();

  function handleAddMovie(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMovieSuccess(null);
    const formData = new FormData();
    formData.append("title", movieForm.title);
    formData.append("year", movieForm.year);
    formData.append("director", movieForm.director);
    formData.append("rating", movieForm.rating);
    formData.append("genre", movieForm.genre);
    formData.append(
      "cast",
      JSON.stringify(
        movieForm.cast
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
      )
    );
    formData.append("synopsis", movieForm.synopsis);
    formData.append("price", movieForm.price);

    if (movieForm.poster) {
      formData.append("poster", movieForm.poster);
    }

    createMovieMutation.mutate(formData, {
      onSuccess: (created) => {
        setMovieForm(emptyForm);
        setFormKey((key) => key + 1);
        setMovieSuccess(`"${created.title}" was added successfully.`);
        toast.success(`"${created.title}" was added successfully`);
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to add movie. Please try again.";
        toast.error(message);
      },
    });
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
        <form
          key={formKey}
          onSubmit={handleAddMovie}
          className="grid gap-4 sm:grid-cols-2"
        >
          {createMovieMutation.isError ? (
            <p className="text-sm text-destructive sm:col-span-2" role="alert">
              {createMovieMutation.error instanceof Error
                ? createMovieMutation.error.message
                : "Failed to add movie. Please try again."}
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
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={movieForm.price}
              onChange={(e) =>
                setMovieForm((f) => ({ ...f, price: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
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
            <Label htmlFor="poster">Poster image</Label>
            <Input
              id="poster"
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                setMovieForm((prev) => ({
                  ...prev,
                  poster: file ?? null,
                }));
              }}
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
            <Button type="submit" disabled={createMovieMutation.isPending}>
              {createMovieMutation.isPending ? "Saving..." : "Save movie"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
