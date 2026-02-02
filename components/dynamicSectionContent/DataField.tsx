import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { SectionTheme, themeStyles } from "./SectionCard";

interface DataFieldProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  theme?: SectionTheme;
}

export function DataField({ label, value, icon: Icon, theme = "blue" }: DataFieldProps) {
  const styles = themeStyles[theme];

  return (
    <div>
      <label className={`text-xs font-semibold ${styles.label} uppercase tracking-wider`}>
        {label}
      </label>
      {Icon ? (
        <div className="flex items-center gap-2 mt-1">
          <Icon className="w-4 h-4 text-gray-400" />
          <p className="text-base font-medium text-gray-900">{value}</p>
        </div>
      ) : (
        <p className="text-base font-medium text-gray-900 mt-1">{value}</p>
      )}
    </div>
  );
}

interface DataGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

export function DataGrid({ children, columns = 2 }: DataGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-x-8 gap-y-6`}>
      {children}
    </div>
  );
}

// Status badge component for inline status display
interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-700";
  // adding line below because of an error
  const tempStatusLabel = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'status_err';
  const displayLabel = label || tempStatusLabel;
  // const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style}`}>
      {displayLabel}
    </span>
  );
}
