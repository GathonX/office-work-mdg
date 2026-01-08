import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Identicon from "@/components/ui/identicon";
import { Loader2 } from "lucide-react";
import { get, post } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

export default function UploadAvatarForm() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { user, setUser } = useAuth();
  const email = (user as any)?.email as string | undefined;
  const name = (user as any)?.name as string | undefined;
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onPick = () => fileRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setStatus(null);
    const f = e.target.files?.[0];
    if (!f) {
      setPreview(null);
      return;
    }
    if (!/^image\//.test(f.type)) {
      setError("Veuillez sélectionner un fichier image");
      toast({ variant: "destructive", title: "Fichier invalide", description: "Veuillez sélectionner une image." });
      e.target.value = "";
      return;
    }
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const onUpload = async () => {
    setError(null);
    setStatus(null);
    const f = fileRef.current?.files?.[0];
    if (!f) {
      setError("Choisissez une image");
      toast({ variant: "destructive", title: "Image requise", description: "Veuillez choisir une image avant de téléverser." });
      return;
    }
    setSubmitting(true);
    try {
      await get("/sanctum/csrf-cookie");
      const fd = new FormData();
      fd.append("avatar", f);
      const res = await post("/api/profile/avatar", fd);
      if (!res.ok) {
        const msg = (res.data as any)?.message || "Échec du téléversement";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      const nextUser = (res.data as any)?.user;
      if (nextUser) setUser(nextUser);
      setStatus("Avatar mis à jour.");
      toast({ title: "Succès", description: "Avatar mis à jour." });
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("Erreur réseau");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={(user as any)?.avatar_url || undefined} alt={name || email || "User"} />
          <AvatarFallback className="bg-transparent p-0">
            <Identicon value={email || name || "user"} size={64} />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <Input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          <Button type="button" variant="secondary" onClick={onPick}>Choose</Button>
          <Button type="button" onClick={onUpload} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      {preview && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Preview:</span>
          <img src={preview} alt="Preview" className="h-16 w-16 rounded-full object-cover border" />
        </div>
      )}
    </div>
  );
}
