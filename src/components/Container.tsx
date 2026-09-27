import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-[92%] max-w-[1200px]", className)}>
      {children}
    </div>
  );
}

/** Small uppercase section label with an amber rule. Used instead of the
 *  usual coloured pill, which reads as generic SaaS. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="rule-label mb-4 text-xs font-bold tracking-[0.2em] text-navy uppercase">
      {children}
    </p>
  );
}
