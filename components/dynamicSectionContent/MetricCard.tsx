import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type MetricTheme = "blue" | "green" | "purple" | "orange" | "pink" | "red";

const themeStyles: Record<MetricTheme, { bg: string; border: string; icon: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-600" },
  green: { bg: "bg-green-50", border: "border-green-100", icon: "text-green-600" },
  purple: { bg: "bg-purple-50", border: "border-purple-100", icon: "text-purple-600" },
  orange: { bg: "bg-orange-50", border: "border-orange-100", icon: "text-orange-600" },
  pink: { bg: "bg-pink-50", border: "border-pink-100", icon: "text-pink-600" },
  red: { bg: "bg-red-50", border: "border-red-100", icon: "text-red-600" },
};

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  theme?: MetricTheme;
}

export function MetricCard({ icon: Icon, value, label, theme = "blue" }: MetricCardProps) {
  const styles = themeStyles[theme];

  return (
    <div className={`${styles.bg} rounded-xl p-5 border ${styles.border}`}>
      <Icon className={`w-8 h-8 ${styles.icon} mb-3`} />
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

// Progress bar component for performance scores
interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  label = "Overall Performance Score",
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getColor = () => {
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const sizeStyles = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className="mb-6">
      {showLabel && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </label>
          <span className={`text-3xl font-bold ${getTextColor()}`}>
            {value}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full ${sizeStyles[size]} overflow-hidden`}>
        <div
          className={`${sizeStyles[size]} rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Metric cards grid wrapper
interface MetricGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function MetricGrid({ children, columns = 3 }: MetricGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 mb-6`}>
      {children}
    </div>
  );
}
