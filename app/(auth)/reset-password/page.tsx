"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    const query = new URLSearchParams(window.location.search);
    return query.get("email") ?? "";
  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => toast.success("Password changed"),
    onError: () => toast.error("Unable to reset password"),
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    mutation.mutate({ email, otp, password });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1  className="text-4xl font-bold tracking-tight text-black">Change Password</h1>
        <p className="text-lg text-gray-600">Create a strong password.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </div>

        <div className="space-y-2">
          <Label>OTP</Label>
          <Input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" required />
        </div>

        <div className="space-y-2">
          <Label>New Password</Label>
          <PasswordField value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <PasswordField value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
        </div>

        <Button className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
