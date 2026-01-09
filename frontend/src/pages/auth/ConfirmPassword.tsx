import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthLayout from "@/components/auth/AuthLayout";
import { get, post } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  password: z.string().min(6, "Au moins 6 caractères"),
});

type FormValues = z.infer<typeof schema>;

export default function ConfirmPassword() {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setStatus(null);
    try {
      await get("/sanctum/csrf-cookie");
      const res = await post("/api/confirm-password", { password: values.password });
      if (!res.ok) {
        const msg = (res.data as any)?.message || "La confirmation a échoué";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      setStatus("Mot de passe confirmé.");
      toast({ title: "Succès", description: "Mot de passe confirmé." });
    } catch {
      setError("Erreur réseau");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Confirmer le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Confirmation..." : "Confirmer"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
