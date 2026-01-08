import React from "react";
import Navbar from "@/components/layout/Navbar";
import { useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  const location = useLocation();
  const showNavbar = location.pathname === "/";
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
