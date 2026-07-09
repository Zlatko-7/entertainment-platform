-- CURSOS LAST CHANGE: link each movie to a Stripe product row for checkout
ALTER TABLE "movies" ADD COLUMN "product_id" uuid;--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;