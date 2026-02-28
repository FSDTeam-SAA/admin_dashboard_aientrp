"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, variables) => {
      toast.success("OTP sent to email");
      router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
    },
    onError: () => toast.error("Failed to send OTP"),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1  className="text-4xl font-bold tracking-tight text-black">Forgot Password</h1>
        <p  className="text-lg text-gray-600">Enter your email to recover your password.</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          mutation.mutate({ email: String(formData.get("email") ?? "") });
        }}
      >
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input name="email" type="email" placeholder="hello@example.com" required />
        </div>

        <Button className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Continue"}
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Back to <Link href="/login" className="font-semibold">Login</Link>
      </p>
    </div>
  );
}
