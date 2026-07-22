export const apiUrl = import.meta.env.VITE_API_URL;

export { authFetch, refreshAccessToken } from "@/auth/api";

export async function parseJsonError(
  res: Response,
  fallback: string
): Promise<never> {
  const data = await res.json().catch(() => null);
  throw new Error(data?.message ?? data?.error ?? fallback);
}
