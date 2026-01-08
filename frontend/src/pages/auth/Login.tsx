import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/components/auth/AuthLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { get, post } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const search = new URLSearchParams(location.search);
  const verifiedFlag = search.get("verified") === "1";
  const verifyRequired = search.get("verify") === "required";
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      // 1) Get CSRF cookie for Sanctum
      await get("/sanctum/csrf-cookie");
      // 2) Login
      const res = await post("/api/login", {
        email: values.email,
        password: values.password,
        remember: !!values.remember,
      });
      if (!res.ok) {
        const msg = (res.data as any)?.message || "Login failed";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      // 3) Fetch current user
      const me = await get("/api/user");
      if (me.ok && me.data) {
        setUser(me.data as any);
        const dest = (location.state as any)?.from?.pathname || "/dashboard";
        toast({ title: "Connexion réussie", description: "Bienvenue !" });
        navigate(dest, { replace: true });
      } else {
        setError("Unable to fetch user after login");
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de récupérer l'utilisateur après connexion." });
      }
    } catch (e) {
      setError("Network error");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          {verifiedFlag && (
            <p className="text-sm text-green-600 mb-2">Votre adresse e-mail a été vérifiée. Vous pouvez vous connecter.</p>
          )}
          {verifyRequired && (
            <div className="mb-2">
              <p className="text-sm text-blue-600">Veuillez vérifier votre e-mail pour continuer.</p>
              <p className="text-xs">
                Vous n'avez pas reçu l'e-mail ? <Link className="underline" to={"/resend-verification?email=" + encodeURIComponent(form.watch("email") || "")}>Renvoyer la vérification</Link>
              </p>
            </div>
          )}
          {(error === "email-not-verified") && (
            <p className="text-xs mb-2">
              Vous n'avez pas reçu l'e-mail ? <Link className="underline" to={"/resend-verification?email=" + encodeURIComponent(form.watch("email") || "")}>Renvoyer la vérification</Link>
            </p>
          )}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" checked={form.watch("remember")} onChange={(e) => form.setValue("remember", e.target.checked)} />
                  <label htmlFor="remember" className="text-sm">Se souvenir de moi</label>
                </div>
                <Link to="/forgot-password" className="text-sm underline">Mot de passe oublié ?</Link>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-muted-foreground">Pas de compte ? </span>
                <Link to="/register" className="text-xs underline">Créer un compte</Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
