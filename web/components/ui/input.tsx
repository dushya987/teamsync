import { clsx } from "clsx";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-[6px] border border-gray-300 px-3 py-2.5 text-[15px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100",
        props.className,
      )}
    />
  );
}
