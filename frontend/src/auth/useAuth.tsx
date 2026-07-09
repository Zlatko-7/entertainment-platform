import React, { useState, useEffect, useContext, createContext } from "react";
import { authFetch, refreshAccessToken } from "./api";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  getUser: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState<User | null>(null);
  // CURSOR: loading=true ONLY DURING INITIAL /me ON APP LOAD — NOT ON LOGIN/LOGOUT REFETCH
  const [loading, setLoading] = useState(true);

  async function fetchMe(): Promise<User | null> {
    const res = await authFetch(`${apiUrl}/api/auth/me`, {
      method: "GET",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  }

  async function bootstrapAuth() {
    setLoading(true);

    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // CURSOR: getUser() UPDATES STATE WITHOUT TOUCHING loading — USED AFTER LOGIN
  async function getUser() {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }

  async function refreshSession() {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      await getUser();
    } else {
      setUser(null);
    }

    return refreshed;
  }

  async function logout() {
    try {
      await authFetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  }

  useEffect(() => {
    bootstrapAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, getUser, refreshSession, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return userContext;
}
