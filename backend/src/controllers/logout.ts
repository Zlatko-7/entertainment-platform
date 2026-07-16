import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { logoutService } from "../services/logout-service.js";

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production
  sameSite: "lax" as const,
};

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    await logoutService({ userId });

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return next(error);
  }
}
