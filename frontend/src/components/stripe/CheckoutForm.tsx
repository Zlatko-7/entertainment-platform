import { authFetch } from "@/auth/api";
import { Button } from "@/components/ui/button";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

interface CheckoutFormProps {
  // CURSOS LAST CHANGE: movieId preferred — backend resolves productId from DB link
  movieId?: string;
  productId?: string;
  onSuccess?: () => void;
}

export default function CheckoutForm({
  movieId,
  productId,
  onSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handlePay() {
    if (!movieId && !productId) {
      setError("No movie or product selected.");
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe is still loading. Try again in a moment.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are missing.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // CURSOS LAST CHANGE: send movieId only; no manual product ID needed
      const res = await authFetch(`${apiUrl}/api/stripe/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          movieId ? { movieId } : { productId },
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Payment setup failed");
      }

      const { clientSecret } = data;

      if (!clientSecret) {
        throw new Error("No client secret returned from server.");
      }

      // CURSOR STRIPE PAYMENT: confirm card payment with Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        throw new Error(result.error.message ?? "Payment failed");
      }

      if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        onSuccess?.();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111",
                "::placeholder": { color: "#6b7280" },
              },
            },
          }}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="text-sm font-medium text-green-600">
          Payment succeeded. Check Stripe Dashboard and orders table.
        </p>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={loading || !stripe}
        onClick={handlePay}
      >
        {loading ? "Processing..." : "Pay now"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Test card: 4242 4242 4242 4242 · any future date · any CVC
      </p>
    </div>
  );
}
