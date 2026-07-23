import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

export function isAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Only admins can add movies", 403));
  }
  return next();
}
