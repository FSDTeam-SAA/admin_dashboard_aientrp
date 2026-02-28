"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronDown, Upload, X } from "lucide-react";
import { PageIntro } from "@/components/dashboard/page-intro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCategories } from "@/lib/api";

export default function InventoryFormPage() {
  const router = useRouter();
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories", "inventory-form"],
    queryFn: () => getCategories({ page: 1, limit: 100 }),
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 3) {
      toast.error("Max 3 photos allowed");
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      toast.success("Inventory saved");
      router.push("/dashboard/inventory");
    },
  });

  return (
    <section className="space-y-8 p-4">
      {/* Back Button and Title */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="h-8 w-8 text-black" />
        </button>
        <h1 className="text-3xl font-bold text-black">Inventory</h1>
      </div>

      <Card className="border-none bg-white p-8 shadow-sm">
        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          {/* Title Field */}
          <div className="space-y-3">
            <Label className="text-lg font-medium">Title</Label>
            <Input placeholder="Rude Ember" className="h-14 rounded-xl border-gray-200 px-6" required />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-lg font-medium">Price</Label>
              <Input placeholder="Tk 2100" className="h-14 rounded-xl border-gray-200 px-6" required />
            </div>
            <div className="space-y-3">
              <Label className="text-lg font-medium">Add Categories</Label>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-6 text-gray-500 outline-none focus:ring-1 focus:ring-gray-300">
                  <option value="">Select category</option>
                  {categories?.items.map((item) => (
                    <option key={String(item.id)} value={item.title}>{item.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-medium">Total Stock</Label>
            <Input placeholder="50 pc" className="h-14 rounded-xl border-gray-200 px-6" required />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-medium">Description</Label>
            <Textarea placeholder="Description" className="min-h-[120px] rounded-xl border-gray-200 p-6" />
          </div>

          {/* Upload Sections */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-lg font-medium">Upload Cover Photo</Label>
              <div 
                onClick={() => coverInputRef.current?.click()}
                className="relative h-48 w-full border-2 border-dashed border-gray-100 rounded-2xl bg-[#fafafa] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
              >
                {coverPreview ? (
                  <div className="relative h-full w-full">
                    <img src={coverPreview} alt="Cover" className="h-full w-full object-contain p-2" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setCover(null); setCoverPreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-[#7c3aed] stroke-[1.5px]" />
                    <span className="text-sm font-medium text-gray-900">Upload Cover</span>
                  </div>
                )}
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-medium">Upload Photo (Max 3)</Label>
              <div 
                onClick={() => photosInputRef.current?.click()}
                className="relative h-48 w-full border-2 border-dashed border-gray-100 rounded-2xl bg-[#fafafa] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-wrap justify-center gap-2 p-4">
                  {photos.map((file, idx) => (
                    <div key={idx} className="relative h-16 w-16 rounded-lg overflow-hidden border bg-white">
                      <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" />
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                        className="absolute top-0 right-0 p-0.5 bg-red-500 rounded-bl-md hover:bg-red-600"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <Upload className="h-6 w-6 text-[#7c3aed] stroke-[1.5px]" />
                      <span className="text-xs font-medium text-gray-500">Add Photos</span>
                    </div>
                  )}
                </div>
                <input ref={photosInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosChange} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-6 pt-6 md:grid-cols-2">
            <Button type="submit" className="h-14 bg-black text-white hover:bg-zinc-800 rounded-xl text-xl font-bold transition-all">
              Upload
            </Button>
            <Button type="button" variant="outline" className="h-14 border-[#7c3aed] text-black hover:bg-gray-50 rounded-xl text-xl font-bold border-[1.5px]" asChild>
              <Link href="/dashboard/inventory">Cancel</Link>
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}