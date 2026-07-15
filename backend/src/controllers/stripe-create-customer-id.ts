import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { Request, Response } from "express";

export async function createStripeCustomerId(req: Request, res: Response) {
  const user = req.body;
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.email,
  });
  await db.update(users).set({
    stripeCustomerId: customer.id,
  });
}
