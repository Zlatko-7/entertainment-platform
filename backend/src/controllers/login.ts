import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../schemas/auth-schema.js";
import { authCookieOptions } from "../lib/cookie-options.js";
import { loginService } from "../services/login-service.js";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await loginService({ email, password });

    res.cookie("accessToken", result.accessToken, {
      ...authCookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", result.refreshToken, {
      ...authCookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: result.user,
    });
  } catch (error) {
    return next(error);
  }
}
