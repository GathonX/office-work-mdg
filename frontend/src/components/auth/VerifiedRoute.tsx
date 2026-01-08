import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function VerifiedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const { initialized, user, isAuthenticated } = useAuth();

  if (!initialized) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  const verified = Boolean((user as any)?.email_verified_at);
  if (!verified) {
    return <Navigate to="/login?verify=required" replace state={{ from: location }} />;
  }
  return children;
}
