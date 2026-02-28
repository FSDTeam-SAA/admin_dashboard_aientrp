"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/auth/password-field";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  if (status === "authenticated") {
    router.replace("/dashboard/banner");
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (response?.ok) {
      toast.success("Login successful");
      router.push("/dashboard/banner");
      return;
    }

    toast.error("Invalid email or password");
  };

  return (
    <div className="space-y-10">
      {/* Header section with bold typography */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-black">Log In</h1>
        <p className="text-lg text-gray-600">
          Access your account to Continue your learning journey.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Email Field with specific label styling */}
        <div className="space-y-3">
          <Label className="text-lg font-medium text-black">Email Address</Label>
          <Input
            type="email"
            className="h-12 border-gray-300 rounded-lg text-base"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="hello@example.com"
            required
          />
        </div>

        {/* Password Field with visibility toggle */}
        <div className="space-y-3">
          <Label className="text-lg font-medium text-black">Password</Label>
          <PasswordField
            className="h-12 border-gray-300 rounded-lg text-base"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="********"
            required
          />
        </div>

        {/* Remember Me & Forgot Password row */}
        <div className="flex items-center justify-end text-base font-medium">
          <Link href="/forgot-password" stroke-width="2" className="text-gray-700 hover:text-black transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Full-width solid black submit button */}
        <Button 
          className="w-full h-14 bg-black text-white text-xl font-bold rounded-lg hover:bg-zinc-800 transition-all" 
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log In"}
        </Button>
      </form>
    </div>
  );
}