"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";

export function OtpInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const chars = value.split("").concat(Array.from({ length: 6 - value.length }, () => ""));

  return (
    <div className="grid grid-cols-6 gap-3">
      {chars.map((char, index) => (
        <Input
          key={index}
          value={char}
          maxLength={1}
          className="h-20 text-center text-3xl font-semibold"
          ref={(el) => {
            refs.current[index] = el;
          }}
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, "").slice(0, 1);
            const next = value.split("");
            next[index] = digit;
            onChange(next.join("").slice(0, 6));
            if (digit && index < 5) refs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !chars[index] && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}
