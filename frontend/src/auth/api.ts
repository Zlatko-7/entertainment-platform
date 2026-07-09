// CURSOR: ON 401 FROM /me (OR OTHER AUTH REQUESTS) AUTO-CALL /refresh-token THEN RETRY ONCE
const apiUrl = import.meta.env.VITE_API_URL;

let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  const res = await fetch(`${apiUrl}/api/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  return res.ok;
}

async function runRefreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function shouldSkipRefresh(url: string) {
  return (
    url.includes("/refresh-token") ||
    url.includes("/login") ||
    url.includes("/signup")
  );
}

export async function authFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (response.status !== 401 || shouldSkipRefresh(input)) {
    return response;
  }

  const refreshed = await runRefreshOnce();

  if (!refreshed) {
    return response;
  }

  return fetch(input, {
    ...init,
    credentials: "include",
  });
}
