import { refreshAccessToken } from "@/auth/api";
import type { User } from "@/api/auth";
import { useLogoutMutation } from "@/hooks/queries/mutations/use-logout-mutation";
import { queryKeys } from "@/hooks/queries/query-keys";
import { useMeQuery } from "@/hooks/queries/use-me-query";
import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";

interface UserContextType {
  user: User | null;
  loading: boolean;
  getUser: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user = null, isPending: loading, refetch } = useMeQuery();
  const logoutMutation = useLogoutMutation();

  async function getUser() {
    await refetch();
  }

  async function refreshSession() {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      await refetch();
    } else {
      queryClient.setQueryData(queryKeys.me, null);
    }

    return refreshed;
  }

  async function logout() {
    await logoutMutation.mutateAsync();
  }

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
