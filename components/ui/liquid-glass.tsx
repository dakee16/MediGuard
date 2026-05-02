import { cn } from "../../lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "tint";
  children: ReactNode;
}

export function LiquidGlass({
  variant = "default",
  className,
  children,
  ...props
}: LiquidGlassProps) {
  const variantClass =
    variant === "strong" ? "glass-strong" :
    variant === "tint" ? "glass-tint" :
    "glass";

  return (
    <div
      className={cn(variantClass, "rounded-3xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}
