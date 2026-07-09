import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { userTokens, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET as string;

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
};

// CURSOR: PUBLIC ROUTE — READS refreshToken COOKIE, ISSUES NEW accessToken ONLY
export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token" });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
      id: string;
    };

    const storedTokens = await db
      .select()
      .from(userTokens)
      .where(eq(userTokens.userId, decoded.id));

    if (!storedTokens.length) {
      return res.status(401).json({ error: "Invalid session" });
    }

    let valid = false;

    for (const storedToken of storedTokens) {
      const match = await bcrypt.compare(refreshToken, storedToken.hashedToken);
      if (match) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    const foundUser = userResult[0];

    if (!foundUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const newAccessToken = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return res.status(200).json({
      message: "Token refreshed",
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid refresh" });
  }
}
