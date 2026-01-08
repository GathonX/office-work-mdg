import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AuthedLayout from "@/components/layout/AuthedLayout";

export default function Dashboard() {
  return (
    <AuthedLayout>
      <div className="space-y-6">
        <header className="mb-2">
          <h2 className="font-semibold text-2xl leading-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Tout les contenu de header sont ici</p>
        </header>
        <Card>
          <CardContent className="p-6">
            {"You're logged in!"}
          </CardContent>
        </Card>
      </div>
    </AuthedLayout>
  );
}
