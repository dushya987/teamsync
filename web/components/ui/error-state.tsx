import { AlertCircle } from "lucide-react";
import { Card } from "./card";

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-red-200 bg-red-50 p-5 text-[#DC2626]">
      <div className="flex items-center gap-2">
        <AlertCircle size={18} />
        <p className="text-[15px] font-medium">{message}</p>
      </div>
    </Card>
  );
}
