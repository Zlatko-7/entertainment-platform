import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { stripeWebhookService } from "../services/stripe-webhook-service.js";

export async function stripeWebhookController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      throw new AppError("Missing stripe-signature header", 400);
    }

    await stripeWebhookService({
      payload: req.body as Buffer,
      signature,
    });

    return res.status(200).json({ received: true });
  } catch (error) {
    return next(error);
  }
}
