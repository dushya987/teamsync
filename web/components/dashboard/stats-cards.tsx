"use client";

import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  activeCount: number;
  doneCount: number;
  highPriorityCount: number;
}

export function StatsCards({
  activeCount,
  doneCount,
  highPriorityCount,
}: Props) {
  const cards = [
    {
      title: "Active Tasks",
      value: activeCount,
      icon: Clock,
      color: "#2563EB",
    },
    {
      title: "Completed",
      value: doneCount,
      icon: CheckCircle2,
      color: "#16A34A",
    },
    {
      title: "High Priority",
      value: highPriorityCount,
      icon: AlertCircle,
      color: "#DC2626",
    },
  ];

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="p-5 transition-shadow duration-150 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-gray-500">{card.title}</p>

                <p className="mt-2 text-[28px] font-bold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div
                className="rounded-full p-3"
                style={{
                  backgroundColor: `${card.color}15`,
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: card.color,
                  }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
