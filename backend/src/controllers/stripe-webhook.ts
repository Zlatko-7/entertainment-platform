import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe.js";
import { db } from "../db/index.js";
import { orders, webhookEvents } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event: Stripe.Event;

  try {
    console.log("STRIPE WEBHOOK HIT");

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature error:", error);
    return res.status(400).send("Webhook Error");
  }

  const existingEvent = await db.query.webhookEvents.findFirst({
    where: eq(webhookEvents.stripeEventId, event.id),
  });

  if (existingEvent) {
    return res.json({ received: true });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment intent succeeded:", paymentIntent.id);
      const charges = await stripe.charges.list({
        payment_intent: paymentIntent.id,
      });
      console.log("CHARGES:", charges.data);

      const receiptUrl = charges.data[0]?.receipt_url ?? null;
      console.log("RECEIPT URL:", receiptUrl);

      const result = await db
        .update(orders)
        .set({ status: "paid", paidAt: new Date(), receiptUrl })
        .where(eq(orders.stripePaymentIntentId, paymentIntent.id))
        .returning();

      if (result.length === 0) {
        console.error("Order not found for PaymentIntent:", paymentIntent.id);

        return res.status(404).json({
          message: "Order not found",
        });
      }

      await db.insert(webhookEvents).values({
        stripeEventId: event.id,
        type: event.type,
        processed: true,
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment intent failed:", paymentIntent.id);

      await db
        .update(orders)
        .set({ status: "failed" })
        .where(eq(orders.stripePaymentIntentId, paymentIntent.id));

      await db.insert(webhookEvents).values({
        stripeEventId: event.id,
        type: event.type,
        processed: true,
      });

      break;
    }

    default:
      console.log("Unhandled event:", event.type);
      break;
  }

  return res.json({ received: true });
}
