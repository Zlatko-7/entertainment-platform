-- CURSOR MIGRATION: Stripe billing tables + users.stripte_customer_id
-- Safe additive migration: no DROP, no DELETE, existing rows are preserved.
-- New tables: products, subscriptions, orders, webhook_events
-- Altered table: users (optional Stripe customer id column)

-- CURSOR MIGRATION: one-time Stripe checkout / payment records
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"stripe_checkout_session_id" text,
	"stripe_payment_intent_id" text,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id"),
	CONSTRAINT "orders_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint

-- CURSOR MIGRATION: sellable plans synced from Stripe (product + price)
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"stripe_product_id" text NOT NULL,
	"stripe_price_id" text NOT NULL,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'eur' NOT NULL,
	"interval" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_stripe_product_id_unique" UNIQUE("stripe_product_id"),
	CONSTRAINT "products_stripe_price_id_unique" UNIQUE("stripe_price_id")
);
--> statement-breakpoint

-- CURSOR MIGRATION: recurring subscription state per user + product
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"status" text NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint

-- CURSOR MIGRATION: idempotent Stripe webhook processing log
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_event_id" text NOT NULL,
	"type" text NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_events_stripe_event_id_unique" UNIQUE("stripe_event_id")
);
--> statement-breakpoint

-- CURSOR MIGRATION: link app users to Stripe customers (nullable — existing users unchanged)
ALTER TABLE "users" ADD COLUMN "stripte_customer_id" text;--> statement-breakpoint

-- CURSOR MIGRATION: foreign keys for orders
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- CURSOR MIGRATION: foreign keys for subscriptions
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- CURSOR MIGRATION: unique Stripe customer id when set
ALTER TABLE "users" ADD CONSTRAINT "users_stripte_customer_id_unique" UNIQUE("stripte_customer_id");