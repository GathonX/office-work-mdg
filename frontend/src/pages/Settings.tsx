import React from "react";
import AuthedLayout from "@/components/layout/AuthedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <AuthedLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your application preferences.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon: customize how you receive updates.</p>
          </CardContent>
        </Card>
      </div>
    </AuthedLayout>
  );
}
