import { Button } from "@/components/ui/button";
import { useCreatePaymentMutation } from "@/hooks/queries/mutations/use-create-payment-mutation";
import { toast } from "react-toastify";

interface CheckoutFormProps {
  // CHECKOUT SESSION FLOW: backend resolves the movie to its Stripe product.
  movieId?: string;
  productId?: string;
}

export default function CheckoutForm({
  movieId,
  productId,
}: CheckoutFormProps) {
  const paymentMutation = useCreatePaymentMutation();

  function handlePay() {
    if (!movieId && !productId) {
      const message = "No movie or product selected.";
      toast.error(message);
      return;
    }

    paymentMutation.mutate(
      movieId ? { movieId } : { productId },
      {
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Payment failed. Please try again.";
          toast.error(message);
        },
      }
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          You will be redirected to Stripe's secure checkout to complete your
          payment.
        </p>
      </div>

      {paymentMutation.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {paymentMutation.error instanceof Error
            ? paymentMutation.error.message
            : "Payment failed. Please try again."}
        </p>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={paymentMutation.isPending}
        onClick={handlePay}
      >
        {paymentMutation.isPending
          ? "Opening checkout..."
          : "Continue to secure checkout"}
      </Button>
    </div>
  );
}
