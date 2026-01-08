import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateProfileInformationForm from "@/components/profile/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/components/profile/UpdatePasswordForm";
import DeleteUserForm from "@/components/profile/DeleteUserForm";
import AuthedLayout from "@/components/layout/AuthedLayout";
import UploadAvatarForm from "@/components/profile/UploadAvatarForm";

export default function ProfilePage() {
  return (
    <AuthedLayout>
      <div className="space-y-6">
        <h2 className="font-semibold text-2xl leading-tight">Profile</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <UploadAvatarForm />
              </div>
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
    </AuthedLayout>
  );
}
