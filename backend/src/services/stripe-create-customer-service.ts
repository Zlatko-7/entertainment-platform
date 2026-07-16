import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "../errors/app-error.js";
import { stripe } from "../lib/stripe.js";

export async function createStripeCustomerService({
  userId,
}: {
  userId: string;
}) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.stripeCustomerId) {
    return { stripeCustomerId: user.stripeCustomerId };
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
  });

  await db
    .update(users)
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, userId));

  return { stripeCustomerId: customer.id };
}
