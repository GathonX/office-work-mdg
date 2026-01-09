import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/components/auth/AuthLayout";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("E-mail invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
  password_confirmation: z.string().min(6, "Au moins 6 caractères"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
});

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", password_confirmation: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setStatus(null);
    try {
      await get("/sanctum/csrf-cookie");
      const res = await post("/api/reset-password", {
        token,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      if (!res.ok) {
        const msg = (res.data as any)?.message || "Échec de la réinitialisation";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      setStatus("Mot de passe réinitialisé. Vous pouvez maintenant vous connecter.");
      toast({ title: "Succès", description: "Mot de passe réinitialisé." });
      navigate("/login", { replace: true });
    } catch {
      setError("Erreur réseau");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Réinitialiser le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
