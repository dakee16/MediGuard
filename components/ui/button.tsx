"use client";

import { cn } from "../../lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface BaseProps {
  variant?: "primary" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
};

const sizeMap = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
};

const variantMap = {
  primary: "btn-primary text-white font-medium",
  glass: "glass-button text-ink-900 font-medium",
  ghost: "text-ink-700 hover:text-ink-900 transition-colors font-medium",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variantMap[variant], sizeMap[size], "select-none", className)}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
}: LinkProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(variantMap[variant], sizeMap[size], "select-none inline-flex items-center justify-center gap-2", className)}
    >
      {children}
    </Link>
  );
}
