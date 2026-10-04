"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { AuthUser, UserRole, ADMIN_ROLES } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
  hasPermission: (key: string) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data.data;
    if (data.token) localStorage.setItem("auth_token", data.token);
    setUser(data);
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("auth_token");
    setUser(null);
    router.push("/login");
  }, [router]);

  const hasRole = useCallback(
    (...roles: UserRole[]) => !!user && roles.includes(user.role),
    [user]
  );

  const hasPermission = useCallback(
    (key: string) => !!user && (ADMIN_ROLES.includes(user.role) || user.permissions.includes(key)),
    [user]
  );

  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, hasPermission, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
