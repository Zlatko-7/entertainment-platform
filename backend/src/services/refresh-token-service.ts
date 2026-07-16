import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users, userTokens } from "../db/schema.js";
import { AppError } from "../errors/app-error.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function refreshTokenService({
  refreshToken,
}: {
  refreshToken?: string;
}) {
  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  let decoded: { id: string };

  try {
    decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const storedTokens = await db
    .select()
    .from(userTokens)
    .where(eq(userTokens.userId, decoded.id));

  if (!storedTokens.length) {
    throw new AppError("Invalid session", 401);
  }

  const tokenMatches = await Promise.all(
    storedTokens.map((token) =>
      bcrypt.compare(refreshToken, token.hashedToken),
    ),
  );

  if (!tokenMatches.some(Boolean)) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.id),
  });

  if (!user) {
    throw new AppError("User not found", 401);
  }

  return {
    accessToken: jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" },
    ),
  };
}
