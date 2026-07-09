import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;

// CURSOR: /me AND /logout READ ONLY accessToken (15m) — refreshToken IS NEVER USED HERE
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
