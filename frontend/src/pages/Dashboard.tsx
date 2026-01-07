import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h2 className="font-semibold text-2xl leading-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Tout les contenu de header sont ici</p>
        </header>
        <Card>
          <CardContent className="p-6">
            {"You're logged in!"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
