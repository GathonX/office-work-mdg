import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { get, put } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const schema = z
  .object({
    current_password: z.string().min(6),
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setStatus(null);
    try {
      await get("/sanctum/csrf-cookie");
      const res = await put("/api/password", values);
      if (!res.ok) {
        const msg = (res.data as any)?.message || "La mise à jour du mot de passe a échoué";
        setError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
        return;
      }
      setStatus("Mot de passe mis à jour.");
      toast({ title: "Succès", description: "Mot de passe mis à jour." });
      form.reset({ current_password: "", password: "", password_confirmation: "" });
    } catch {
      setError("Erreur réseau");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
              <FormLabel>Nouveau mot de passe</FormLabel>
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
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
