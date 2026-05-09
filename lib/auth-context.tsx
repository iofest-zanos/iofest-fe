"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth, clearTokens, getAccessToken, MeUser, setTokens } from "./api";

interface AuthState {
  user: MeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<MeUser>;
  verifyOtp: (email: string, code: string) => Promise<MeUser>;
  register: (input: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    profession?: string;
    bio?: string;
  }) => Promise<{ email: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await auth.me();
      setUser(me);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await auth.login({ email, password });
    setTokens(data.access, data.refresh);
    setUser(data.user);
    return data.user;
  }, []);

  const verifyOtp = useCallback(async (email: string, code: string) => {
    const data = await auth.verifyOtp({ email, code });
    setTokens(data.access, data.refresh);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(
    async (input: {
      full_name: string;
      email: string;
      password: string;
      phone?: string;
      profession?: string;
      bio?: string;
    }) => {
      const data = await auth.register(input);
      return { email: data.email };
    },
    [],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, verifyOtp, register, logout, refresh }),
    [user, loading, login, verifyOtp, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
