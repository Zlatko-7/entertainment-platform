import { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { AppError } from "../errors/app-error.js";

export async function createStripeCustomerId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
    });

    await db
      .update(users)
      .set({
        stripeCustomerId: customer.id,
      })
      .where(eq(users.id, userId));

    return res.json({
      stripeCustomerId: customer.id,
    });
  } catch (error) {
    return next(error);
  }
}
