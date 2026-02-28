"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageIntro } from "@/components/dashboard/page-intro";
import { SearchInput } from "@/components/dashboard/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";

import { deleteBanner, getBanners } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function BannerListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch banners
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  // API shape: { success, message, data: [...] }
  const bannerList = apiResponse ?? [];

  console.log(bannerList, "eragvbrtg")

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Delete banner
  const removeMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      toast.success("Banner deleted");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: () => toast.error("Delete failed"),
  });

  // Filter
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return bannerList;

    return bannerList.filter((item: any) =>
      String(item?.title || "").toLowerCase().includes(s)
    );
  }, [bannerList, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paged = filtered.slice(startIndex, endIndex);

  // Showing text (handles empty results)
  const showingFrom = filtered.length === 0 ? 0 : startIndex + 1;
  const showingTo = filtered.length === 0 ? 0 : Math.min(endIndex, filtered.length);

  return (
    <section className="space-y-6">
      <PageIntro
        title="Banner"
        subtitle="Create and manage your community banners with ease."
      />

      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div className="w-full max-w-2xl">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <Button
          className="h-14 rounded-xl bg-black px-8 text-lg font-bold hover:bg-zinc-800"
          asChild
        >
          <Link href="/dashboard/banner/new" className="flex items-center justify-center">
            <Plus className="mr-2 h-6 w-6" /> Add New
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-sm">
        {isLoading ? (
          <TableSkeleton rows={8} columns={4} />
        ) : isError ? (
          <div className="p-8 text-center text-gray-500">
            Failed to load banners.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="py-6 pl-8 text-xl font-bold text-black">
                  Banner Image
                </TableHead>
                <TableHead className="py-6 text-xl font-bold text-black">
                  Date
                </TableHead>
                <TableHead className="py-6 text-xl font-bold text-black">
                  Banner Name
                </TableHead>
                <TableHead className="py-6 text-center text-xl font-bold text-black">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-gray-500">
                    No banners found.
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((item: any) => (
                  <TableRow
                    key={item._id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell className="py-6 pl-8">
                      <div className="relative h-16 w-36 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                        {item?.image?.url ? (
                          <Image
                            src={item.image.url}
                            alt={item?.title || "Banner"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-6 text-lg font-medium text-gray-600">
                      {formatDate(item?.createdAt)}
                    </TableCell>

                    <TableCell className="py-6 text-lg font-medium text-gray-600">
                      {item?.title || "-"}
                    </TableCell>

                    <TableCell className="py-6">
                      <div className="flex justify-center gap-4">
                        <Link
                          href={`/dashboard/banner/new?id=${item._id}`}
                          className="p-1 text-gray-400 transition-colors hover:text-black"
                          aria-label="Edit banner"
                        >
                          <Pencil className="h-6 w-6" />
                        </Link>

                        <button
                          className="p-1 text-red-400 transition-colors hover:text-red-600 disabled:opacity-50"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this banner?")) {
                              removeMutation.mutate(item._id);
                            }
                          }}
                          disabled={removeMutation.isPending}
                          aria-label="Delete banner"
                        >
                          <Trash2 className="h-6 w-6" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <div className="flex flex-col items-start justify-between gap-3 py-4 text-lg text-gray-500 md:flex-row md:items-center">
        <p>
          Showing {showingFrom} to {showingTo} of {filtered.length} results
        </p>

        <PaginationControls
          page={safePage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </section>
  );
}