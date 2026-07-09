import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "./CheckoutForm";

interface CheckoutWrapperProps {
  // CURSOS LAST CHANGE: pass movieId from MoviesSection Buy modal
  movieId?: string;
  productId?: string;
  title?: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function CheckoutWrapper({
  movieId,
  productId,
  title = "Checkout",
  onClose,
  onSuccess,
}: CheckoutWrapperProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {onClose ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        ) : null}
      </CardHeader>

      <CardContent>
        {/* CURSOR STRIPE PAYMENT: Elements provider loads publishable key once */}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            movieId={movieId}
            productId={productId}
            onSuccess={onSuccess}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}
