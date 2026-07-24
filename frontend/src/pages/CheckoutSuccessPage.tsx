import { Button } from "@/components/ui/button";
import { RouteUrls } from "@/routes/urls";
import { Check, Clapperboard, Library } from "lucide-react";
import { Link } from "react-router";

export default function CheckoutSuccessPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.01_90)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_oklch(0.96_0.02_145)_0%,_transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-foreground/[0.03] blur-3xl"
      />

      <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
        <p className="mb-8 text-center text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          MediaStore
        </p>

        <div className="rounded-2xl border border-border/80 bg-background/80 p-8 shadow-[0_24px_80px_-40px_oklch(0.2_0_0_/_0.35)] backdrop-blur-sm sm:p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 animate-in zoom-in duration-700">
            <Check className="size-8 stroke-[2.5]" aria-hidden />
          </div>

          <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Purchase Successful!{" "}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Payment confirmed. Your title is unlocked and ready to watch in your
            library.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="gap-2"
              render={<Link to={RouteUrls.library} />}
            >
              <Library className="size-4" />
              Open library
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              render={<Link to={RouteUrls.movie} />}
            >
              <Clapperboard className="size-4" />
              Browse movies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
