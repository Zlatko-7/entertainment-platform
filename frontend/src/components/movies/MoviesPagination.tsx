import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MoviesPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

export function MoviesPagination({
  page,
  totalPages,
  onPageChange,
}: MoviesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Movies pagination"
      className="mt-10 flex flex-col items-center gap-3"
    >
      {/* CURSOR PAGINATION: premium status label above the control bar */}
      <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        Page {page} of {totalPages}
      </p>

      {/* CURSOR PAGINATION: glass-style pill container for numbered controls */}
      <div className="inline-flex items-center gap-1 rounded-2xl border border-border/60 bg-card/90 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03] backdrop-blur-sm">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {/* CURSOR PAGINATION: numbered page buttons with active-state emphasis */}
        {visiblePages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1.5 text-sm font-medium text-muted-foreground select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={page === item ? "default" : "ghost"}
              size="sm"
              aria-label={`Go to page ${item}`}
              aria-current={page === item ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                "min-w-9 rounded-xl px-3 tabular-nums transition-all duration-300",
                page === item
                  ? "bg-foreground text-background shadow-[0_6px_20px_rgba(0,0,0,0.18)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item}
            </Button>
          )
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
