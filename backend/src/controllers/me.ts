import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export async function getMe(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = req.user.id;
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const user = result[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
