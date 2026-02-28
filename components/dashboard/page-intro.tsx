import { cn } from "@/lib/utils";

export function PageIntro({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="type-heading text-zinc-900">{title}</h2>
      <p className="type-body-lg text-zinc-600">{subtitle}</p>
    </div>
  );
}
