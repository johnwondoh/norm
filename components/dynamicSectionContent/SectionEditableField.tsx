import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { SectionTheme, themeStyles } from "./SectionCard";

interface SectionEditableFieldProps {
  label: string;
  value: string | null | undefined;
  icon?: LucideIcon;
  theme?: SectionTheme;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "tel" | "date" | "select";
  options?: Array<{ value: string; label: string }>;
  multiline?: boolean;
  name: string;
}

export function SectionEditableField({
  label,
  value,
  icon: Icon,
  theme = "blue",
  isEditing = false,
  onChange,
  type = "text",
  options,
  multiline = false,
  name,
}: SectionEditableFieldProps) {
  const styles = themeStyles[theme];

  const renderInput = () => {
    const inputClasses =
      "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-medium text-gray-900";

    if (type === "select" && options) {
      return (
        <select
          name={name}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={inputClasses}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (multiline) {
      return (
        <textarea
          name={name}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={inputClasses}
          rows={3}
        />
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={inputClasses}
      />
    );
  };

  return (
    <div>
      <label
        className={`text-xs font-semibold ${styles.label} uppercase tracking-wider block mb-2`}
      >
        {label}
      </label>

      {isEditing ? (
        renderInput()
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          <p className="text-base font-medium text-gray-900">{value || "-"}</p>
        </div>
      )}
    </div>
  );
}
