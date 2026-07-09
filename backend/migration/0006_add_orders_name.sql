ALTER TABLE "orders" ADD COLUMN "order_name" text;--> statement-breakpoint
UPDATE "orders" AS o
SET "order_name" = p.name
FROM "products" AS p
WHERE o.product_id = p.id AND o.order_name IS NULL;--> statement-breakpoint
UPDATE "orders" SET "order_name" = 'Order' WHERE "order_name" IS NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_name" SET NOT NULL;
