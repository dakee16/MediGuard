"use client";

import { cn } from "../../lib/utils";
import { useEffect, useRef, useState, ReactNode, ElementType } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: ElementType;
}

export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Component = Tag as ElementType;
  return (
    <Component
      ref={ref}
      className={cn("reveal", delay && `delay-${delay}`, visible && "in-view", className)}
    >
      {children}
    </Component>
  );
}
