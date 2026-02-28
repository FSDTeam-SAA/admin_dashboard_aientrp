"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageIntro } from "@/components/dashboard/page-intro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { deleteReel, getReels } from "@/lib/api";

const PAGE_SIZE = 10;

export default function ReelsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reels", page],
    queryFn: () => getReels({ page, limit: PAGE_SIZE }),
  });

  const removeMutation = useMutation({
    mutationFn: deleteReel,
    onSuccess: () => {
      toast.success("Reel deleted");
      queryClient.invalidateQueries({ queryKey: ["reels"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <PageIntro title="Reels" subtitle="Create and manage your community reels with ease." />
        <Button asChild className="h-14 px-6">
          <Link href="/dashboard/reels/new" className="flex items-center justify-center">
            <Plus className="mr-2 h-5 w-5" /> Add New
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-none bg-[#f4f4f4]">
          <TableSkeleton rows={3} columns={5} />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {data?.items.map((item) => (
            <div key={item._id} className="space-y-2">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-300 bg-white">
                {item.reels?.[0]?.url ? (
                  <Image src={item.reels[0].url} alt={item.title} fill className="object-cover" unoptimized />
                ) : null}
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-white p-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600"
                  onClick={() => removeMutation.mutate(item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-3 text-xl text-zinc-600 md:flex-row md:items-center">
        <p>
          Showing {((data?.pagination.currentPage ?? 1) - 1) * PAGE_SIZE + 1} to {Math.min((data?.pagination.currentPage ?? 1) * PAGE_SIZE, data?.pagination.total ?? 0)} of {data?.pagination.total ?? 0} results
        </p>
        <PaginationControls page={page} totalPages={data?.pagination.totalPages ?? 1} onChange={setPage} />
      </div>
    </section>
  );
}

