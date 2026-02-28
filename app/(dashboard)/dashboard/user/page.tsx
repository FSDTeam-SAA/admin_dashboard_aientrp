"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { PageIntro } from "@/components/dashboard/page-intro";
import { SearchInput } from "@/components/dashboard/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { getUsers, updateUser } from "@/lib/api";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", search, page],
    queryFn: () => getUsers({ search, page, limit: PAGE_SIZE }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateUser(id, payload),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    },
    onError: () => toast.error("Update failed"),
  });

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateMutation.mutate({
      id: editingUser.id,
      payload: {
        name: formData.get("name"),
        email: formData.get("email"),
      },
    });
  };

  return (
    <section className="space-y-6">
      <PageIntro title="Member Accounts" subtitle="Create and manage your community members with ease." />

      <div className="flex flex-col justify-between gap-3 md:flex-row">
        {/* Search input styled to match */}
        <div className="w-full max-w-2xl">
           <SearchInput value={search} onChange={setSearch} />
        </div>
        <Button className="h-14 bg-black px-8 text-lg font-bold hover:bg-zinc-800" asChild>
          <Link href="/dashboard/user/new" className="flex items-center justify-center">
            <Plus className="mr-2 h-6 w-6" /> Add New
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-sm">
        {isLoading ? (
          <TableSkeleton rows={9} columns={4} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-xl font-bold text-black py-6">Member Name</TableHead>
                <TableHead className="text-xl font-bold text-black py-6">Email Address</TableHead>
                <TableHead className="text-xl font-bold text-black py-6">Password</TableHead>
                <TableHead className="text-xl font-bold text-black py-6 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((item) => (
                <TableRow key={String(item.id)} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <TableCell className="text-lg text-gray-600 py-6">
                    {`${item.first_name ?? ""} ${item.last_name ?? ""}`}
                  </TableCell>
                  <TableCell className="text-lg text-gray-600 py-6">{item.email}</TableCell>
                  <TableCell className="text-lg text-gray-600 py-6">****************</TableCell>
                  <TableCell className="py-6">
                    <div className="flex justify-center gap-4">
                      {/* Edit button triggers the modal */}
                      <button 
                        onClick={() => setEditingUser(item)}
                        className="p-1 text-gray-400 hover:text-black transition-colors"
                      >
                        <Pencil className="h-6 w-6" />
                      </button>
                      <button className="p-1 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Pagination following the visual style of */}
      <div className="flex flex-col items-start justify-between gap-3 text-lg text-gray-500 md:flex-row md:items-center py-4">
        <p>
          Showing {((data?.pagination.currentPage ?? 1) - 1) * PAGE_SIZE + 1} to {Math.min((data?.pagination.currentPage ?? 1) * PAGE_SIZE, data?.pagination.total ?? 0)} of {data?.pagination.total ?? 0} results
        </p>
        <div className="flex gap-2 items-center">
            {/* Replace with your specific Pagination component logic */}
            <button className="h-10 w-10 flex items-center justify-center border rounded-lg text-gray-400">{"<"}</button>
            <button className="h-10 w-10 flex items-center justify-center bg-black text-white rounded-lg">1</button>
            <button className="h-10 w-10 flex items-center justify-center border rounded-lg">2</button>
            <button className="h-10 w-10 flex items-center justify-center border rounded-lg">{">"}</button>
        </div>
      </div>

      {/* UPDATE USER MODAL */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-[550px] rounded-[32px] p-10">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-black mb-4">Update User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-medium text-black">Full Name</Label>
              <Input 
                name="name" 
                defaultValue={editingUser?.name || `${editingUser?.first_name} ${editingUser?.last_name}`}
                className="h-14 border-gray-200 rounded-xl px-6 text-base"
                required 
              />
            </div>
            <div className="space-y-3">
              <Label className="text-lg font-medium text-black">Email</Label>
              <Input 
                name="email" 
                type="email"
                defaultValue={editingUser?.email}
                className="h-14 border-gray-200 rounded-xl px-6 text-base"
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button 
                type="submit" 
                className="h-14 bg-black text-white rounded-xl text-lg font-bold"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditingUser(null)}
                className="h-14 border-[#7c3aed] text-black rounded-xl text-lg font-bold"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}