import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { get, post, put } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("E-mail invalide"),
  phone: z.string().max(25, "25 caractères max").optional().or(z.literal("")),
  address: z.string().max(255, "255 caractères max").optional().or(z.literal("")),
  job_title: z.string().max(100, "100 caractères max").optional().or(z.literal("")),
  location: z.string().max(150, "150 caractères max").optional().or(z.literal("")),
  bio: z.string().max(500, "500 caractères max").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function UpdateProfileInformationForm() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", address: "", job_title: "", location: "", bio: "" },
  });

  useEffect(() => {
    const name = (user as any)?.name as string | undefined;
    const email = (user as any)?.email as string | undefined;
    const phone = (user as any)?.phone as string | undefined;
    const address = (user as any)?.address as string | undefined;
    const job_title = (user as any)?.job_title as string | undefined;
    const location = (user as any)?.location as string | undefined;
    const bio = (user as any)?.bio as string | undefined;
    form.reset({
      name: name || "",
      email: email || "",
      phone: phone || "",
      address: address || "",
      job_title: job_title || "",
      location: location || "",
      bio: bio || "",
    });
  }, [user]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setStatus(null);
    try {
      await get("/sanctum/csrf-cookie");
      const res = await put("/api/profile", values);
      if (!res.ok) {
        const msg = (res.data as any)?.message || "Mise à jour échouée";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      const user = (res.data as any)?.user;
      if (user) {
        setUser(user);
      }
      setStatus("Profil mis à jour.");
      toast({ title: "Succès", description: "Profil mis à jour." });
    } catch {
      setError("Erreur réseau");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    }
  };

  const resendVerification = async () => {
    setError(null);
    setStatus(null);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre professionnel</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Ex: Développeur Full Stack" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localisation</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Ville, Pays" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio courte</FormLabel>
              <FormControl>
                <Textarea maxLength={500} rows={4} {...field} />
              </FormControl>
              <div className="text-[10px] text-muted-foreground">{(field.value?.length || 0)}/500</div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button type="button" variant="secondary" onClick={resendVerification} disabled={resending}>
            {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {resending ? "Envoi..." : "Renvoyer l'email de vérification"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
