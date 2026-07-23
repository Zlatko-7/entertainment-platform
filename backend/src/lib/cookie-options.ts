const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

/** Cookie settings that work on localhost and cross-site Vercel (frontend ≠ backend). */
export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};
