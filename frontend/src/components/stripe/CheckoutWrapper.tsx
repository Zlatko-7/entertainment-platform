import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CheckoutForm from "./CheckoutForm";

interface CheckoutWrapperProps {
  // CURSOS LAST CHANGE: pass movieId from MoviesSection Buy modal
  movieId?: string;
  productId?: string;
  title?: string;
  onClose?: () => void;
}

export default function CheckoutWrapper({
  movieId,
  productId,
  title = "Checkout",
  onClose,
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
        {/* CHECKOUT SESSION FLOW: hosted Checkout does not need Elements. */}
        <CheckoutForm movieId={movieId} productId={productId} />
      </CardContent>
    </Card>
  );
}
