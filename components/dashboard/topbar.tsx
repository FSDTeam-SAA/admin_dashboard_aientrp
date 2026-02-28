"use client";

import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/utils";

export function DashboardTopbar({ title = "Dashboard" }: { title?: string }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-zinc-300 bg-white px-6 lg:px-8">
      <h1 className="type-heading text-zinc-900">{title}</h1>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-base font-bold text-white">
        {getInitials(session?.user?.name)}
      </div>
    </header>
  );
}
