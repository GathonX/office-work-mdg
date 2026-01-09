import React from "react";
import AuthedLayout from "@/components/layout/AuthedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Identicon from "@/components/ui/identicon";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, MapPin, Phone, Briefcase, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { get } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function AboutUser() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await get("/api/user");
      if (res.ok && res.data) {
        setUser(res.data as any);
        toast({ title: "Actualisé", description: "Informations mises à jour." });
      } else {
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de récupérer l'utilisateur." });
      }
    } catch {
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const u: any = user || {};
  const email: string | undefined = u.email;
  const name: string | undefined = u.name;
  const phone: string | undefined = u.phone;
  const address: string | undefined = u.address;
  const jobTitle: string | undefined = u.job_title;
  const location: string | undefined = u.location;
  const bio: string | undefined = u.bio;
  const createdAt: string | undefined = u.created_at;

  return (
    <AuthedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl leading-tight">À propos de l'utilisateur</h2>
          <Button onClick={refresh} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
            {loading ? "Actualisation..." : "Actualiser"}
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={u?.avatar_url || undefined} alt={name || email || "Utilisateur"} />
                <AvatarFallback className="bg-transparent p-0">
                  <Identicon value={email || name || "user"} size={64} />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{name || "Nom indisponible"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{email}</span>
                </div>
                {createdAt && (
                  <div className="text-xs text-muted-foreground">Inscrit le {new Date(createdAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded border p-3">
                <div className="text-xs text-muted-foreground">Téléphone</div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{phone || "—"}</span>
                </div>
              </div>
              <div className="rounded border p-3">
                <div className="text-xs text-muted-foreground">Adresse</div>
                <div className="text-sm mt-1">{address || "—"}</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-xs text-muted-foreground">Titre professionnel</div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{jobTitle || "—"}</span>
                </div>
              </div>
              <div className="rounded border p-3">
                <div className="text-xs text-muted-foreground">Localisation</div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{location || "—"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs text-muted-foreground">Bio</div>
              <p className="text-sm mt-1 whitespace-pre-wrap">{bio || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthedLayout>
  );
}
