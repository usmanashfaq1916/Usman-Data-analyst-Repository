import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  open: "bg-success/10 text-success border-success/20",
  closing_soon: "bg-warning/10 text-warning border-warning/20",
  closed: "bg-danger/10 text-danger border-danger/20",
  upcoming: "bg-secondary/10 text-secondary border-secondary/20",
  Public: "bg-primary/10 text-primary border-primary/20",
  Private: "bg-secondary/10 text-secondary border-secondary/20",
  default: "bg-surface text-gray-600 border-border",
} as const;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant] || badgeVariants.default,
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
