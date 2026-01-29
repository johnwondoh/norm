import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SummaryMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function SummaryMetricCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100",
  trend,
  className,
}: SummaryMetricCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 bg-white rounded-xl border border-slate-200 shadow-sm",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex items-center justify-center h-14 w-14 rounded-xl",
          iconBgColor
        )}
      >
        <Icon className={cn("h-7 w-7", iconColor)} />
      </div>
    </div>
  );
}

export default SummaryMetricCard;
