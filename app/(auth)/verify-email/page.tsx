"use client";

import { useMutation } from "@tanstack/react-query";
import { Clock3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");

  const mutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => toast.success("Email verified"),
    onError: () => toast.error("Invalid OTP"),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-black">Verify Email</h1>
        <p className="text-lg text-gray-600">Enter OTP to verify your email address.</p>
      </div>

      <OtpInput value={otp} onChange={setOtp} />

      <div className="flex items-center justify-between text-2xl text-zinc-700">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-5 w-5" /> 00:59
        </span>
        <button type="button" className="hover:underline">
          Didn&apos;t get a code? Resend it
        </button>
      </div>

      <Button
        className="w-full"
        disabled={mutation.isPending || otp.length !== 6}
        onClick={() => mutation.mutate({ otp })}
      >
        {mutation.isPending ? "Verifying..." : "Continue"}
      </Button>
    </div>
  );
}
