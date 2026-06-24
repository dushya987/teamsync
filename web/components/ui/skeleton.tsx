import { clsx } from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx("animate-pulse rounded-[8px] bg-gray-200", className)}
    />
  );
}
