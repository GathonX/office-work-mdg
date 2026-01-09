import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/components/auth/AuthLayout";
import { get, post } from "@/lib/api";
import { Link, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("E-mail invalide"),
});

type FormValues = z.infer<typeof schema>;

export default function ResendVerification() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const prefillEmail = params.get("email") || "";

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: prefillEmail },
  });

  useEffect(() => {
    const email = params.get("email");
    if (email) {
      form.setValue("email", email);
    }
  }, [location.search]);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setStatus(null);
    try {
      await get("/sanctum/csrf-cookie");
      const res = await post("/api/email/resend-verification", { email: values.email });
      if (!res.ok) {
        const msg = (res.data as any)?.message || "Impossible de renvoyer l'e-mail de vérification";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      setStatus("Lien de vérification renvoyé. Veuillez vérifier votre boîte de réception.");
      toast({ title: "Succès", description: "Lien de vérification renvoyé." });
    } catch (e) {
      setError("Erreur réseau");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Renvoyer l'e-mail de vérification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Si vous n'avez pas reçu l'e-mail, entrez votre adresse et nous vous enverrons un nouveau lien de vérification.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Link to="/login" className="text-sm underline">Retour à la connexion</Link>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Envoi..." : "Renvoyer le lien de vérification"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
