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
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error(error);
    return res.status(400).send("Webhook Error");
  }

  const existingEvent = await db.query.webhookEvents.findFirst({
    where: eq(webhookEvents.stripeEventId, event.id),
  });

  if (existingEvent) {
    return res.json({ received: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("CHECKOUT COMPLETED:", session.id);

      console.log("PAYMENT STATUS:", session.payment_status);

      const result = await db
        .update(orders)
        .set({
          status: "paid",
          paidAt: new Date(),
        })
        .where(eq(orders.stripeCheckoutSessionId, session.id))
        .returning();

      console.log("UPDATED ORDER:", result);

      await db.insert(webhookEvents).values({
        stripeEventId: event.id,
        type: event.type,
        processed: true,
      });

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;

      const checkoutSessionId = invoice.metadata?.checkoutSessionId;

      console.log("INVOICE PAID:", invoice.id);

      if (invoice.hosted_invoice_url && checkoutSessionId) {
        await db
          .update(orders)
          .set({
            invoiceUrl: invoice.hosted_invoice_url,
          })
          .where(eq(orders.stripeCheckoutSessionId, checkoutSessionId));
      }

      await db.insert(webhookEvents).values({
        stripeEventId: event.id,
        type: event.type,
        processed: true,
      });

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      await db
        .update(orders)
        .set({
          status: "failed",
        })
        .where(eq(orders.stripeCheckoutSessionId, session.id));

      await db.insert(webhookEvents).values({
        stripeEventId: event.id,
        type: event.type,
        processed: true,
      });

      break;
    }

    default:
      console.log("Unhandled event:", event.type);
  }

  return res.json({
    received: true,
  });
}
