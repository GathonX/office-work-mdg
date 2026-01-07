import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";

export default function VerifyEmail() {
  const resend = () => {
    console.log("resend verification email");
  };
  const logout = () => {
    console.log("logout");
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Thanks for signing up! Please verify your email address by clicking the link we just emailed to you. If you didn't receive the email, we can send another.
          </p>
          <div className="flex items-center justify-between">
            <Button onClick={resend}>Resend Verification Email</Button>
            <Button variant="secondary" onClick={logout}>Log Out</Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
