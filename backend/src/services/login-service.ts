import { db } from "../db/index.js";
import { users, userTokens } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export async function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const user = result[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "30d",
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await db.insert(userTokens).values({
    id: crypto.randomUUID(),
    userId: user.id,
    hashedToken: hashedRefreshToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
