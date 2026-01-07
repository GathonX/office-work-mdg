import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateProfileInformationForm from "@/components/profile/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/components/profile/UpdatePasswordForm";
import DeleteUserForm from "@/components/profile/DeleteUserForm";

export default function ProfilePage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-2xl leading-tight mb-6">Profile</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateProfileInformationForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdatePasswordForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <DeleteUserForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
