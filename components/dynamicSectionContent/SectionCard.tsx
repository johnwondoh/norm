import { forwardRef, ReactNode } from "react";
import { LucideIcon, Edit2, Save, X } from "lucide-react";

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
  editable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export const SectionCard = forwardRef<HTMLElement, SectionCardProps>(
  ({ id, title, icon: Icon, theme, children, editable = false, isEditing = false, onEdit, onSave, onCancel, isSaving = false }, ref) => {
    const styles = themeStyles[theme];

    return (
      <section
        id={id}
        ref={ref}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${styles.bg} rounded-xl`}>
              <Icon className={`w-6 h-6 ${styles.icon}`} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>

          {editable && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
        {children}
      </section>
    );
  }
);

SectionCard.displayName = "SectionCard";

// Export theme styles for use in child components
export { themeStyles };
