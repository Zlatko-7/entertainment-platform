import { NextFunction, Request, Response } from "express";
import { signupSchema } from "../schemas/auth-schema.js";
import { signupService } from "../services/signup-service.js";

export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    const user = await signupService({ name, email, password });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
}
