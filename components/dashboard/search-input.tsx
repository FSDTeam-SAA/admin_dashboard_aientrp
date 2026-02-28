import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput({ value, onChange, placeholder = "Search" }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="type-body-lg h-14 rounded-2xl border-zinc-200 pl-12"
      />
    </div>
  );
}
