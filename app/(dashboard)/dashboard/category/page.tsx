"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { getCategories } from "@/lib/api";

const PAGE_SIZE = 10;

export default function CategoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["categories", search, page],
    queryFn: () => getCategories({ search, page, limit: PAGE_SIZE }),
  });

  return (
    <section className="space-y-6">
      <PageIntro
        title="Category"
        subtitle="Create and manage your community category with ease."
      />

      <div className="flex flex-col gap-3 md:flex-row justify-between">
        <div className="w-full max-w-2xl">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <Button className="flex items-center justify-center h-14 px-6">
          <Plus className="mr-2 h-5 w-5" /> Add New Category
        </Button>
      </div>

      <Card className="overflow-hidden border-none bg-[#f4f4f4]">
        {isLoading ? (
          <TableSkeleton rows={9} columns={5} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>
                    <div className="relative h-14 w-14 overflow-hidden rounded-md border border-zinc-200 bg-white">
                      {item.image?.src ? (
                        <Image
                          src={item.image.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.handle}</TableCell>
                  <TableCell>{Number(item.id) % 200 || 80}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <div className="flex flex-col items-start justify-between gap-3 text-xl text-zinc-600 md:flex-row md:items-center">
        <p>
          Showing {((data?.pagination.currentPage ?? 1) - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(
            (data?.pagination.currentPage ?? 1) * PAGE_SIZE,
            data?.pagination.total ?? 0,
          )}{" "}
          of {data?.pagination.total ?? 0} results
        </p>
        <PaginationControls
          page={page}
          totalPages={data?.pagination.totalPages ?? 1}
          onChange={setPage}
        />
      </div>
    </section>
  );
}
