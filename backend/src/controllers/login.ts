import { db } from "../db/index.js";
import { users, userTokens } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { loginSchema } from "../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production
  sameSite: "lax" as const,
};

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = result[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "JWT_SECRET is not set in environment" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await db.insert(userTokens).values({
      id: crypto.randomUUID(),
      userId: user.id,
      hashedToken: hashedRefreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
    });

    // CURSOR: accessToken 15m httpOnly + refreshToken 30d httpOnly SET ON LOGIN
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
