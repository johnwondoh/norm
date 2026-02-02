import { forwardRef, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// Color theme configuration
export type SectionTheme =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "pink"
  | "indigo"
  | "red";

const themeStyles: Record<
  SectionTheme,
  { bg: string; icon: string; label: string }
> = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    label: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    label: "text-purple-600",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    label: "text-green-600",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    label: "text-orange-600",
  },
  pink: {
    bg: "bg-pink-50",
    icon: "text-pink-600",
    label: "text-pink-600",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    label: "text-indigo-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-500",
    label: "text-red-500",
  },
};

interface SectionCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  theme: SectionTheme;
  children: ReactNode;
}

export const SectionCard = forwardRef<HTMLElement, SectionCardProps>(
  ({ id, title, icon: Icon, theme, children }, ref) => {
    const styles = themeStyles[theme];

    return (
      <section
        id={id}
        ref={ref}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 ${styles.bg} rounded-xl`}>
            <Icon className={`w-6 h-6 ${styles.icon}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
      </section>
    );
  }
);

SectionCard.displayName = "SectionCard";

// Export theme styles for use in child components
export { themeStyles };
