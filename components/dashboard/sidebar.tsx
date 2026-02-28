"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Settings, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { dashboardNavItems } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    toast.success("Logged out successfully");
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-black p-2 text-white lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[280px] border-r border-zinc-300 bg-[#E8E8E8] p-6 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="mb-10 flex items-center justify-center relative">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <button 
              onClick={() => setOpen(false)} 
              className="absolute right-0 lg:hidden p-1 bg-black/5 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-3">
            {dashboardNavItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "type-body-lg flex h-[52px] items-center gap-4 rounded-xl border border-black px-4 transition-all",
                    active
                      ? "bg-black text-white"
                      : "bg-[#F0F0F0]/50 text-black hover:bg-black/5",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto space-y-3">
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className={cn(
                "type-body-lg flex h-[52px] items-center gap-4 rounded-xl border border-black px-4 transition-all",
                pathname === "/dashboard/settings"
                  ? "bg-black text-white"
                  : "bg-[#F0F0F0]/50 text-black hover:bg-black/5",
              )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>

            <Button
              className="type-body-lg h-[52px] w-full rounded-xl border-none bg-[#FF0000] text-white transition-colors hover:bg-red-700"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="mr-2 h-5 w-5" /> Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md" 
            onClick={() => setShowLogoutModal(false)} 
          />
          <div className="relative w-full max-w-sm scale-in-center rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <LogOut className="h-8 w-8" />
              </div>
              <h3 className="type-heading text-zinc-900">Are you sure?</h3>
              <p className="type-body-md mt-2 text-zinc-500">
                You will need to log back in to access your dashboard.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="type-body-md h-12 flex-1 rounded-xl border-zinc-300"
                onClick={() => setShowLogoutModal(false)}
              >
                No, Keep me in
              </Button>
              <Button
                className="type-body-md h-12 flex-1 rounded-xl bg-[#FF0000] text-white hover:bg-red-700"
                onClick={handleLogout}
              >
                Yes, Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
