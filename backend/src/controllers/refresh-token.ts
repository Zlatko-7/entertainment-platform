import { NextFunction, Request, Response } from "express";
import { authCookieOptions } from "../lib/cookie-options.js";
import { refreshTokenService } from "../services/refresh-token-service.js";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;

export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await refreshTokenService({ refreshToken });

    res.cookie("accessToken", accessToken, {
      ...authCookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return res.status(200).json({
      message: "Token refreshed",
    });
  } catch (error) {
    return next(error);
  }
}
