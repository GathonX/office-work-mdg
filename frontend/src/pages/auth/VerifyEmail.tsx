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
        const msg = (res.data as any)?.message || "Impossible d'envoyer l'e-mail de vérification";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      setStatus("Lien de vérification envoyé.");
      toast({ title: "Succès", description: "Lien de vérification envoyé." });
    } catch {
      setError("Erreur réseau");
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
          <CardTitle>Vérifiez votre e-mail</CardTitle>
        </CardHeader>
        <CardContent>
          
          <p className="text-sm text-muted-foreground mb-4">
            Merci pour votre inscription ! Veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer. Si vous n'avez pas reçu l'e-mail, nous pouvons en renvoyer un.
          </p>
          <div className="flex items-center justify-between">
            <Button onClick={resend} disabled={resending}>
              {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {resending ? "Renvoi en cours..." : "Renvoyer l'e-mail de vérification"}
            </Button>
            <Button variant="secondary" onClick={logout}>Se déconnecter</Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
