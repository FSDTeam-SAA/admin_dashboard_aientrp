"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  onChange: (value: number) => void;
};

export function PaginationControls({ page, totalPages, onChange }: Props) {
  const pages = [] as (number | "dots")[];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("dots");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i += 1) pages.push(i);
    if (page < totalPages - 2) pages.push("dots");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="outline" onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      {pages.map((item, index) =>
        item === "dots" ? (
          <Button key={`dots-${index}`} size="icon" variant="outline" disabled>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            key={item}
            size="icon"
            variant={item === page ? "default" : "outline"}
            onClick={() => onChange(item)}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        size="icon"
        variant="outline"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
