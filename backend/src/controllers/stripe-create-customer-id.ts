import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { createStripeCustomerService } from "../services/stripe-create-customer-service.js";

export async function createStripeCustomerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await createStripeCustomerService({ userId });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
