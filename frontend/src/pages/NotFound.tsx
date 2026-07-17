import { Button } from "@/components/ui/button";
import { RouteUrls } from "@/routes/urls";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <div>
        <p className="text-5xl font-bold tracking-tight">404</p>
        <h1 className="mt-2 text-lg font-semibold">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you are looking for doesn’t exist or has been moved.
        </p>
      </div>
      <Button>
        <Link to={RouteUrls.movie}>Back to movies</Link>
      </Button>
    </div>
  );
}
