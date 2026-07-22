import { apiUrl, authFetch, parseJsonError } from "@/api/client";
import type { LoginFormData } from "@/lib/schemas/login-schema";
import type { SignupFormData } from "@/lib/schemas/signup-schema";

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export async function fetchMe(): Promise<User | null> {
  const res = await authFetch(`${apiUrl}/api/auth/me`, {
    method: "GET",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function login(data: LoginFormData): Promise<void> {
  const res = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  if (!res.ok) {
    await parseJsonError(res, "Invalid email or password");
  }

  await res.json();
}

export async function signup(data: SignupFormData): Promise<unknown> {
  const res = await fetch(`${apiUrl}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      responseData?.message ?? "Could not create account. Please try again."
    );
  }

  return responseData;
}

export async function logout(): Promise<void> {
  await authFetch(`${apiUrl}/api/auth/logout`, {
    method: "POST",
  });
}
