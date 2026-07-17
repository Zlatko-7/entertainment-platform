import { authFetch } from "@/auth/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Film,
  Library,
  Receipt,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";

interface OrderMovie {
  posterUrl: string | null;
  year: number | null;
  genre: string | null;
  director: string | null;
}

interface Order {
  id: string;
  productId: string;
  orderName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
  invoiceUrl: string | null;
  movie: OrderMovie | null;
}

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

function formatPurchaseDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

async function fetchOrderHistory(apiUrl: string): Promise<Order[]> {
  const ordersRes = await authFetch(`${apiUrl}/api/order-history`, {
    method: "GET",
  });

  if (!ordersRes.ok) {
    throw new Error("Could not load your purchases");
  }

  const ordersData = await ordersRes.json();
  return ordersData.data ?? [];
}

export function LibrarySection() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    data: orders = [],
    isPending: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order-history"],
    queryFn: () => fetchOrderHistory(apiUrl),
  });

  useEffect(() => {
    if (!isError || !error) return;

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong loading your library",
    );
  }, [isError, error]);

  const purchasedMovies = useMemo(
    () =>
      [...orders]
        .filter((order) => order.status === "paid")
        .sort(
          (a, b) =>
            new Date(b.paidAt ?? b.createdAt).getTime() -
            new Date(a.paidAt ?? a.createdAt).getTime(),
        ),
    [orders],
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your library
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Movies you own. Purchases appear here after payment is confirmed.
          </p>
        </div>

        {!loading && purchasedMovies.length > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span className="font-medium">{purchasedMovies.length}</span>
            <span className="text-muted-foreground">
              {purchasedMovies.length === 1 ? "title owned" : "titles owned"}
            </span>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-3xl border-border/60 py-0 shadow-sm"
            >
              <div className="aspect-[2/2.55] animate-pulse bg-muted" />
              <CardContent className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!loading && isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Something went wrong loading your library"}
        </div>
      ) : null}

      {!loading && !isError && purchasedMovies.length === 0 ? (
        <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-gradient-to-b from-muted/30 to-muted/10 px-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
            <Library className="size-7 text-muted-foreground" />
          </div>
          <p className="text-base font-medium">No purchases yet</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            When you buy a movie from the catalog, it will show up here with
            your receipt and purchase details.
          </p>
        </div>
      ) : null}

      {!loading && !isError && purchasedMovies.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {purchasedMovies.map((order) => {
            const movie = order.movie;
            const purchaseDate = order.paidAt ?? order.createdAt;

            return (
              <Card
                key={order.id}
                className="group overflow-hidden rounded-3xl border border-border/60 bg-card py-0 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              >
                <div className="relative aspect-[2/2.55] overflow-hidden bg-muted">
                  {movie?.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={order.orderName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted via-muted/70 to-background">
                      <Film className="mb-2 size-10 text-muted-foreground/70" />
                      <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                        Owned
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase shadow-lg backdrop-blur-sm">
                    <CheckCircle2 className="size-3" />
                    Owned
                  </span>

                  {movie?.year ? (
                    <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-white/90 uppercase backdrop-blur-md">
                      {movie.year}
                    </span>
                  ) : null}

                  <div className="absolute right-3 bottom-3 left-3">
                    <CardTitle className="line-clamp-2 text-base leading-snug font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                      {order.orderName}
                    </CardTitle>
                    {movie?.director ? (
                      <p className="mt-1 line-clamp-1 text-xs text-white/75">
                        Directed by {movie.director}
                      </p>
                    ) : null}
                  </div>
                </div>

                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                        Paid
                      </p>
                      <p className="text-lg font-bold tracking-tight tabular-nums">
                        {formatMoney(order.amount, order.currency)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                        Purchased
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground/80">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        {formatPurchaseDate(purchaseDate)}
                      </p>
                    </div>
                  </div>

                  {movie?.genre ? (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {movie.genre.split(",")[0]?.trim()}
                    </p>
                  ) : null}

                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                  {order.invoiceUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-full gap-2 rounded-xl"
                    >
                      <a
                        href={order.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-row gap-2 justifyc-center items-center"
                      >
                        <Receipt className="size-3.5" />
                        View receipt
                        <ExternalLink className="size-3.5 opacity-60" />
                      </a>
                    </Button>
                  ) : (
                    <div className="flex h-9 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
                      Receipt will appear after Stripe confirms payment
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
