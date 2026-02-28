"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoryFormValues = {
  title: string;
  handle: string;
  imageUrl?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: Partial<CategoryFormValues> & { id?: string | number };
  loading?: boolean;
  onSubmit: (values: CategoryFormValues) => void;
};

export function CategoryModal({
  open,
  onOpenChange,
  mode,
  initial,
  loading,
  onSubmit,
}: Props) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [handle, setHandle] = React.useState(initial?.handle ?? "");
  const [imageUrl, setImageUrl] = React.useState(initial?.imageUrl ?? "");

  React.useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setHandle(initial?.handle ?? "");
    setImageUrl(initial?.imageUrl ?? "");
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      handle: handle.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">
            {mode === "create" ? "Add New Category" : "Edit Category"}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Category Name
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Electronics"
              className="h-12"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Handle / Slug
            </label>
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. electronics"
              className="h-12"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Image URL (optional)
            </label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="h-12"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button className="h-12 w-full" disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create"
                  : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}