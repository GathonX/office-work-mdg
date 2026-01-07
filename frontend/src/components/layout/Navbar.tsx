import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">DevFolio</Link>
        <nav className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/profile">{user?.name ?? "Profile"}</Link>
              </Button>
              <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
