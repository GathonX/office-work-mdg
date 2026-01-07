import React, { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/lib/api";

type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
    // Try to restore session via Sanctum cookie
    (async () => {
      try {
        const res = await get<AuthUser>("/api/user");
        if (res.ok && res.data) {
          setUser(res.data as any);
          localStorage.setItem("auth_user", JSON.stringify(res.data));
        }
      } catch {}
      setInitialized(true);
    })();
  }, []);

  const login = (tok: string, usr?: AuthUser) => {
    setToken(tok);
    localStorage.setItem("auth_token", tok);
    if (usr) {
      setUser(usr);
      localStorage.setItem("auth_user", JSON.stringify(usr));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user || !!token, login, logout, setUser, initialized }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
