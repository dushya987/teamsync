import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={clsx(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] px-4 py-2.5 text-[15px] font-medium outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
        variant === "primary" && "bg-[#2563EB] text-white hover:bg-[#1E40AF]",
        variant === "secondary" &&
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        variant === "ghost" && "text-gray-600 hover:bg-gray-100",
        variant === "danger" && "bg-[#DC2626] text-white hover:bg-red-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
