import { CheckCircle2 } from "lucide-react";
import { Card } from "./card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-10 text-center">
      <CheckCircle2 className="mx-auto mb-3 text-[#16A34A]" size={32} />
      <h2 className="text-[22px] font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-[15px] text-gray-500">{description}</p>
    </Card>
  );
}
