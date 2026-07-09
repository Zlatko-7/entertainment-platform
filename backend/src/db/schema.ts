import { timeStamp } from "console";
import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  stripeCustomerId: text("stripte_customer_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userTokens = pgTable("user_tokens", {
  id: uuid("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  hashedToken: text("hashed_token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});

export const movies = pgTable("movies", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  director: text("director").notNull(),
  rating: real("rating").notNull(), // 0 - 10
  genre: text("genre").notNull(),
  actors: text("actors").array().notNull(),
  synopsis: text("synopsis").notNull(),
  posterUrl: text("poster_url").notNull(),
  price: real("price").notNull(),
  // CURSOS LAST CHANGE: FK links each movie to a row in products for Stripe checkout
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  // optional future-proof
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stripeProductId: text("stripe_product_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull().unique(),
  price: integer("price").notNull(),
  currency: text("currency").default("eur").notNull(),
  interval: text("interval").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),

  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  receiptUrl: text("receipt_url"),
  paidAt: timestamp("paid_at"),
  orderName: text("order_name").notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  type: text("type").notNull(),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
