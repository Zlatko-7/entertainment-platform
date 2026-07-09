ALTER TABLE "movies" ADD COLUMN "price" real;
--> statement-breakpoint
UPDATE "movies" SET "price" = round((1 + random() * 24)::numeric, 2);
--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "price" SET NOT NULL;
