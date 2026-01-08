import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";
import { Link } from "react-router-dom";

export default function CheckEmail() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Check your inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            We sent a verification link to your email. Click the link to verify your account.
          </p>
          <div className="flex justify-end">
            <Button asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
