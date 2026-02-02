import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// Generic list item interface
export interface InfoListItem {
  id?: string | number;
  primary: string;
  secondary: string;
  trailing?: ReactNode;
  icon?: LucideIcon;
  status?: "valid" | "signed" | "pending" | "expired";
  onClick?: () => void;
}

interface InfoListProps {
  title?: string;
  items: InfoListItem[];
  showDivider?: boolean;
}

export function InfoList({ title, items, showDivider = false }: InfoListProps) {
  const statusStyles = {
    valid: "bg-green-100 text-green-700",
    signed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    expired: "bg-red-100 text-red-700",
  };

  return (
    <div className={showDivider ? "mt-8 pt-6 border-t border-gray-100" : ""}>
      {title && (
        <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id ?? index}
              className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl ${
                item.onClick ? "hover:bg-gray-100 transition-colors cursor-pointer" : ""
              }`}
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                <div>
                  <p className="font-medium text-gray-900">{item.primary}</p>
                  <p className="text-sm text-gray-500">{item.secondary}</p>
                </div>
              </div>
              {item.trailing && (
                <div className="flex-shrink-0">{item.trailing}</div>
              )}
              {item.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[item.status]
                  }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Specialized trailing component for amounts (used in payments)
interface AmountTrailingProps {
  amount: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function AmountTrailing({ amount, variant = "success" }: AmountTrailingProps) {
  const variantStyles = {
    default: "text-gray-900",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  return (
    <p className={`text-lg font-semibold ${variantStyles[variant]}`}>
      {amount}
    </p>
  );
}

// Specialized trailing component for time (used in schedules)
interface TimeTrailingProps {
  time: string;
}

export function TimeTrailing({ time }: TimeTrailingProps) {
  return (
    <p className="text-sm font-medium text-gray-600">{time}</p>
  );
}
