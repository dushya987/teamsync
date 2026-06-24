import { clsx } from "clsx";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-[8px] border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
