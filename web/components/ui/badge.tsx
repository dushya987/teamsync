import { clsx } from "clsx";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "primary";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={clsx(
        "inline-flex min-w-[115px] items-center justify-center rounded-full border px-3 py-1.5 text-[13px] font-semibold tracking-wide",
        variant === "default" && "border-gray-200 bg-gray-50 text-gray-600",
        variant === "success" && "border-green-200 bg-green-50 text-[#16A34A]",
        variant === "warning" &&
          "border-orange-200 bg-orange-50 text-[#D97706]",
        variant === "danger" && "border-red-200 bg-red-50 text-[#DC2626]",
        variant === "primary" && "border-blue-200 bg-blue-50 text-[#2563EB]",
      )}
    >
      {children}
    </span>
  );
}
