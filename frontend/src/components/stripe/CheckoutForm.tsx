import { authFetch } from "@/auth/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

interface CheckoutFormProps {
  // CHECKOUT SESSION FLOW: backend resolves the movie to its Stripe product.
  movieId?: string;
  productId?: string;
}

export default function CheckoutForm({
  movieId,
  productId,
}: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!movieId && !productId) {
      const message = "No movie or product selected.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(`${apiUrl}/api/stripe/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieId ? { movieId } : { productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Payment setup failed");
      }

      const { url } = data;

      if (typeof url !== "string" || !url) {
        throw new Error("Checkout URL was not returned by the server.");
      }

      // CHECKOUT SESSION FLOW: Stripe hosts the payment form, so redirect
      // to the session URL instead of confirming a PaymentIntent in React.
      window.location.assign(url);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          You will be redirected to Stripe's secure checkout to complete your
          payment.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={loading}
        onClick={handlePay}
      >
        {loading ? "Opening checkout..." : "Continue to secure checkout"}
      </Button>
    </div>
  );
}
