"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageIntro } from "@/components/dashboard/page-intro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, getProfile } from "@/lib/api";

export default function SettingsPage() {
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => toast.error("Failed to change password"),
  });

  return (
    <section className="space-y-6">
      <PageIntro title="Setting" subtitle="Edit your personal information" />

      <Card className="border border-zinc-700 bg-[#f4f4f4] p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-300 bg-white">
            {profile?.profileImage?.url ? (
              <Image src={profile.profileImage.url} alt={profile.name} fill className="object-cover" unoptimized />
            ) : null}
          </div>
          <div>
            <h3 className="text-4xl font-semibold">{isLoading ? "Loading..." : profile?.name || "Admin"}</h3>
            <p className="text-3xl text-zinc-700">@{profile?.role || "user"}</p>
          </div>
        </div>
      </Card>

      <Card className="border border-zinc-700 bg-[#f4f4f4] p-6">
        <h3 className="mb-4 text-4xl font-semibold">Change password</h3>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (newPassword !== confirmPassword) {
              toast.error("Passwords do not match");
              return;
            }
            mutation.mutate({ currentPassword, newPassword });
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="min-w-48" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
