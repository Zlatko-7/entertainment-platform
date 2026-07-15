import { NextFunction, Request, Response } from "express";
import { meService } from "../services/me-service.js";
import { AppError } from "../errors/app-error.js";

export async function getMeController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const result = await meService({ userId });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
