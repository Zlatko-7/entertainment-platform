import { NextFunction, Request, Response } from "express";
import { purchasedItemsServices } from "../services/purchased-items-service.js";

export async function purchasedItemsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const result = await purchasedItemsServices({ userId });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return next(error);
  }
}
