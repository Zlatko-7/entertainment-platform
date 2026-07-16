import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { userTokens } from "../db/schema.js";

export async function logoutService({ userId }: { userId: string }) {
  await db.delete(userTokens).where(eq(userTokens.userId, userId));
}
