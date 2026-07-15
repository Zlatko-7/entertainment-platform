import { NextFunction, Request, Response } from "express";
import { createPaymentService } from "../services/create-payment-service.js";
import { AppError } from "../errors/app-error.js";

export async function createPaymentController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { productId, movieId } = req.body as {
      productId?: string;
      movieId?: string;
    };

    const results = await createPaymentService({
      userId,
      movieId,
      productId,
      userEmail: userEmail || "",
    });

    return res.json(results);
  } catch (error) {
    return next(error);
  }
}
