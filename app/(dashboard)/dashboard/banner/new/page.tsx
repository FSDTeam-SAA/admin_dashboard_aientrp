"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, Upload, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBanner, getBanners, updateBanner } from "@/lib/api";

export default function BannerFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({ queryKey: ["banners"], queryFn: getBanners });
  const existing = useMemo(() => data?.find((item) => item._id === editId), [data, editId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // NEW: Function to clear the image and reset the upload area
  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the click from triggering the file input
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the actual input value
    }
  };

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      toast.success("Banner uploaded");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      router.push("/dashboard/banner");
    },
    onError: () => toast.error("Upload failed"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) => updateBanner(id, payload),
    onSuccess: () => {
      toast.success("Banner updated");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      router.push("/dashboard/banner");
    },
    onError: () => toast.error("Update failed"),
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = new FormData();
    payload.append("title", String(formData.get("title") ?? ""));
    payload.append("product", String(formData.get("product") ?? ""));
    
    if (image) {
      payload.append("image", image);
    } else if (existing?.image) {
      // Retain existing image if no new one is selected
      payload.append("existingImage", existing.image);
    }

    if (editId) {
      updateMutation.mutate({ id: editId, payload });
      return;
    }
    createMutation.mutate(payload);
  };

  return (
    <section className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Back Button and Title Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-8 w-8 text-black" />
        </button>
        <h1 className="text-3xl font-bold text-black">Banner</h1>
      </div>

      <Card className="border-none bg-white p-8 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Title Field */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">Title</Label>
            <div className="relative">
              <Input 
                name="title" 
                defaultValue={existing?.title} 
                placeholder="Title" 
                className="h-14 bg-white border-gray-200 rounded-xl px-6 text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300" 
                required 
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6 pointer-events-none" />
            </div>
          </div>

          {/* Tag a Product Field */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">Tag a Product</Label>
            <div className="relative">
              <Input 
                name="product" 
                defaultValue={existing?.product} 
                placeholder="Tag a Product" 
                className="h-14 bg-white border-gray-200 rounded-xl px-6 text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300" 
                required 
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6 pointer-events-none" />
            </div>
          </div>

          {/* Upload Banner Box with Close Button */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">Upload Banner</Label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative h-64 w-full border-2 border-dashed border-gray-100 rounded-2xl bg-[#fafafa] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
            >
              {(preview || existing?.image) ? (
                <div className="relative h-full w-full">
                  <img 
                    src={preview || (existing?.image.startsWith('http') ? existing.image : `/${existing?.image}`)} 
                    alt="Preview" 
                    className="h-full w-full object-contain p-4" 
                  />
                  {/* Close Icon Overlay */}
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black transition-colors"
                  >
                    <X className="h-6 w-6 text-white stroke-[2.5px]" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[#7c3aed]">
                    <Upload className="h-10 w-10 stroke-[1.5px]" />
                  </div>
                  <span className="text-xl font-medium text-gray-900">Upload Banner</span>
                </div>
              )}
              <Input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} 
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid gap-6 pt-6 md:grid-cols-2">
            <Button 
              type="submit" 
              className="h-14 bg-black text-white hover:bg-zinc-800 rounded-xl text-xl font-bold transition-all"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editId ? "Save" : "Upload"}
            </Button>
            <Button 
            type="button"
            variant="outline"
            className="h-14 border-[#7c3aed] text-black hover:bg-gray-50 rounded-xl text-xl font-bold border-[1.5px]"
            asChild
            >
              <Link href="/dashboard/banner">Cancel</Link>
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}