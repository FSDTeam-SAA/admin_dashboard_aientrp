"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageIntro } from "@/components/dashboard/page-intro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createReel, getInventory } from "@/lib/api";

export default function ReelFormPage() {
  const [video, setVideo] = useState<File | null>(null);

  const { data: products } = useQuery({
    queryKey: ["inventory", "reel-form"],
    queryFn: () => getInventory({ page: 1, limit: 100 }),
  });

  const mutation = useMutation({
    mutationFn: createReel,
    onSuccess: () => toast.success("Reel uploaded"),
    onError: () => toast.error("Upload failed"),
  });

  return (
    <section className="space-y-6">
      <PageIntro title="Reels" subtitle="Create and manage your community reels with ease." />

      <Card className="border-none bg-[#f4f4f4] p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const payload = new FormData();
            payload.append("title", String(formData.get("title") ?? ""));
            payload.append("about", String(formData.get("about") ?? ""));
            payload.append("category", String(formData.get("category") ?? "General"));
            if (video) payload.append("reels", video);
            mutation.mutate(payload);
          }}
        >
          <div className="space-y-2">
            <Label>Title</Label>
            <Input name="title" placeholder="Rude Ember" required />
          </div>

          <div className="space-y-2">
            <Label>Tag a Product</Label>
            <select name="product" className="h-12 w-full rounded-xl border border-zinc-800/60 bg-white px-4">
              {products?.items.map((item) => (
                <option key={String(item.id)} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input placeholder="Tk 2100" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="about" placeholder="Description" required />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input name="category" placeholder="Perfume" required />
          </div>

          <div className="space-y-2">
            <Label>Upload Video</Label>
            <Input type="file" accept="video/*" onChange={(event) => setVideo(event.target.files?.[0] ?? null)} required />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Button type="submit" disabled={mutation.isPending || !video}>
              {mutation.isPending ? "Uploading..." : "Upload"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/reels">Cancel</Link>
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
