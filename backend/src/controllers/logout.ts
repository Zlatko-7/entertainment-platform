import { db } from "../db/index.js";
import { userTokens } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production
  sameSite: "lax" as const,
};

export async function logout(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // CURSOR: DELETE DB REFRESH TOKEN + CLEAR BOTH httpOnly COOKIES
    await db.delete(userTokens).where(eq(userTokens.userId, user.id));

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
