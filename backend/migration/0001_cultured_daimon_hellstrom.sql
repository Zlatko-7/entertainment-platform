ALTER TABLE "movies" ADD COLUMN "actors" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" DROP COLUMN "cast";