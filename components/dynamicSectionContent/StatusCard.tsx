import { LucideIcon } from "lucide-react";

type StatusTheme = "green" | "blue" | "purple" | "orange" | "red" | "yellow";

const themeStyles: Record<
  StatusTheme,
  { bg: string; border: string; icon: string; title: string; status: string }
> = {
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-600",
    title: "text-green-800",
    status: "text-green-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-800",
    status: "text-blue-700",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "text-purple-600",
    title: "text-purple-800",
    status: "text-purple-700",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: "text-orange-600",
    title: "text-orange-800",
    status: "text-orange-700",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    title: "text-red-800",
    status: "text-red-700",
  },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-600",
    title: "text-yellow-800",
    status: "text-yellow-700",
  },
};

interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  status: string;
  description: string;
  theme?: StatusTheme;
}

export function StatusCard({
  icon: Icon,
  title,
  status,
  description,
  theme = "green",
}: StatusCardProps) {
  const styles = themeStyles[theme];

  return (
    <div className={`p-5 ${styles.bg} border ${styles.border} rounded-xl`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${styles.icon}`} />
        <h3 className={`font-semibold ${styles.title}`}>{title}</h3>
      </div>
      <p className={`text-sm font-medium ${styles.status} mb-1`}>{status}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

// Container for multiple status cards
interface StatusCardListProps {
  children: React.ReactNode;
}

export function StatusCardList({ children }: StatusCardListProps) {
  return <div className="space-y-4">{children}</div>;
}
