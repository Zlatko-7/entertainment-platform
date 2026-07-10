import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FilterOption } from "@/types/dashboard";
import { albums, formatPrice, matchesAlbumFilter } from "@/utils/dashboard";
import { Disc3, ShoppingBag } from "lucide-react";
import { useMemo } from "react";

interface MusicSectionProps {
  searchQuery: string;
  activeFilter: FilterOption;
}

export function MusicSection({ searchQuery, activeFilter }: MusicSectionProps) {
  const filteredAlbums = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return albums.filter((album) => {
      const matchesSearch =
        query.length === 0 ||
        album.title.toLowerCase().includes(query) ||
        album.artist.toLowerCase().includes(query) ||
        album.tag.toLowerCase().includes(query);

      return (
        matchesSearch &&
        matchesAlbumFilter(album.price, album.tag, activeFilter)
      );
    });
  }, [searchQuery, activeFilter]);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Music albums</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and buy digital media.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredAlbums.map((album) => (
          <Card key={album.id} className="overflow-hidden py-0 ring-0">
            <div className="flex aspect-square items-center justify-center border-b border-border bg-muted">
              <Disc3 className="size-8 text-muted-foreground" />
            </div>
            <CardHeader className="pt-4">
              <CardTitle className="text-base">{album.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{album.artist}</p>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-lg font-medium">{formatPrice(album.price)}</p>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/30">
              <Button type="button" className="w-full gap-2" size="sm">
                <ShoppingBag className="size-3.5" />
                Buy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredAlbums.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No albums match your search.
        </p>
      ) : null}
    </>
  );
}
