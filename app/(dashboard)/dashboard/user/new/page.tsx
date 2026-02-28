"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/lib/api";

export default function UserFormPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created");
      router.push("/dashboard/user");
    },
    onError: () => toast.error("Create failed"),
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  };

  return (
    <section className="max-w-5xl mx-auto space-y-8 p-4">
      {/* Back Button and Title Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-8 w-8 text-black" />
        </button>
        <h1 className="text-3xl font-bold text-black">Create Member Accounts</h1>
      </div>

      <Card className="border-none bg-white p-8 sm:p-12 shadow-sm">
        <form className="space-y-8" onSubmit={onSubmit}>
          {/* Full Name Field */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-black">Full name</Label>
            <Input 
              name="name" 
              placeholder="Courtney Henry" 
              className="h-14 border-gray-200 rounded-xl px-6 text-base focus-visible:ring-1 focus-visible:ring-gray-300"
              required 
            />
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-black">Email</Label>
            <Input 
              name="email" 
              type="email" 
              placeholder="example@gmail.com" 
              className="h-14 border-gray-200 rounded-xl px-6 text-base focus-visible:ring-1 focus-visible:ring-gray-300"
              required 
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-black">Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="****************"
                className="h-14 border-gray-200 rounded-xl px-6 pr-14 text-base focus-visible:ring-1 focus-visible:ring-gray-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-6" />
                ) : (
                  <Eye className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-6 pt-6 md:grid-cols-2">
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="h-14 bg-black text-white hover:bg-zinc-800 rounded-xl text-xl font-bold"
            >
              {mutation.isPending ? "Creating..." : "Create User"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="h-14 border-[#7c3aed] text-black hover:bg-gray-50 rounded-xl text-xl font-bold border-[1.5px]"
              asChild
            >
              <Link href="/dashboard/user">Cancel</Link>
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}