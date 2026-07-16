import { and, eq, isNull } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "../db/index.js";
import { orders, webhookEvents } from "../db/schema.js";
import { AppError } from "../errors/app-error.js";
import { stripe } from "../lib/stripe.js";

async function getHostedInvoiceUrl(
  invoiceRef: string | Stripe.Invoice | null | undefined
) {
  if (!invoiceRef) return null;

  const invoiceId = typeof invoiceRef === "string" ? invoiceRef : invoiceRef.id;

  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoice.hosted_invoice_url ?? null;
}

export async function stripeWebhookService({
  payload,
  signature,
}: {
  payload: Buffer;
  signature: string | string[];
}) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new AppError("STRIPE_WEBHOOK_SECRET is not set", 500);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    throw new AppError("Invalid Stripe webhook signature", 400);
  }

  const existingEvent = await db.query.webhookEvents.findFirst({
    where: eq(webhookEvents.stripeEventId, event.id),
  });

  if (existingEvent) {
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceUrl = await getHostedInvoiceUrl(session.invoice);

      await db
        .update(orders)
        .set({
          status: "paid",
          paidAt: new Date(),
          ...(invoiceUrl ? { invoiceUrl } : {}),
        })
        .where(eq(orders.stripeCheckoutSessionId, session.id));
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const checkoutSessionId = invoice.metadata?.checkoutSessionId;
      const userId = invoice.metadata?.userId;
      const productId = invoice.metadata?.productId;

      if (!invoice.hosted_invoice_url) {
        break;
      }

      if (checkoutSessionId) {
        await db
          .update(orders)
          .set({ invoiceUrl: invoice.hosted_invoice_url })
          .where(eq(orders.stripeCheckoutSessionId, checkoutSessionId));
        break;
      }

      if (userId && productId) {
        await db
          .update(orders)
          .set({ invoiceUrl: invoice.hosted_invoice_url })
          .where(
            and(
              eq(orders.userId, userId),
              eq(orders.productId, productId),
              eq(orders.status, "paid"),
              isNull(orders.invoiceUrl)
            )
          );
      }
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
      break;
    }
  }

  await db.insert(webhookEvents).values({
    stripeEventId: event.id,
    type: event.type,
    processed: true,
  });
}
