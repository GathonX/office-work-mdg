import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";
import { get, post } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { logout: ctxLogout } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);

  const resend = async () => {
    setStatus(null);
    setError(null);
    try {
      setResending(true);
      await get("/sanctum/csrf-cookie");
      const res = await post("/api/email/verification-notification");
      if (!res.ok) {
        const msg = (res.data as any)?.message || "Unable to send verification email";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      setStatus("Verification link sent.");
      toast({ title: "Succès", description: "Lien de vérification envoyé." });
    } catch {
      setError("Network error");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    } finally {
      setResending(false);
    }
  };

  const logout = async () => {
    try {
      await get("/sanctum/csrf-cookie");
      await post("/api/logout");
    } catch {}
    ctxLogout();
    toast({ title: "Déconnexion", description: "Vous avez été déconnecté." });
    navigate("/");
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
        </CardHeader>
        <CardContent>
          
          <p className="text-sm text-muted-foreground mb-4">
            Thanks for signing up! Please verify your email address by clicking the link we just emailed to you. If you didn't receive the email, we can send another.
          </p>
          <div className="flex items-center justify-between">
            <Button onClick={resend} disabled={resending}>
              {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {resending ? "Resending..." : "Resend Verification Email"}
            </Button>
            <Button variant="secondary" onClick={logout}>Log Out</Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
