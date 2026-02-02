import { ReactNode, useState, useEffect, useRef } from "react";
import { LucideIcon, Edit2, Check, X } from "lucide-react";
import { SectionTheme, themeStyles } from "./SectionCard";

interface EditableDataFieldProps {
  label: string;
  value: string | null | undefined;
  icon?: LucideIcon;
  theme?: SectionTheme;
  editable?: boolean;
  onSave?: (newValue: string) => Promise<void>;
  type?: "text" | "email" | "tel" | "date" | "select";
  options?: Array<{ value: string; label: string }>;
  multiline?: boolean;
}

export function EditableDataField({
  label,
  value,
  icon: Icon,
  theme = "blue",
  editable = false,
  onSave,
  type = "text",
  options,
  multiline = false
}: EditableDataFieldProps) {
  const styles = themeStyles[theme];
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  const handleSave = async () => {
    if (!onSave || editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
      setEditValue(value || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const renderInput = () => {
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-medium text-gray-900";

    if (type === "select" && options) {
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={inputClasses}
          disabled={isSaving}
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
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={inputClasses}
          disabled={isSaving}
          rows={3}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={inputClasses}
        disabled={isSaving}
      />
    );
  };

  return (
    <div className="group relative">
      <label className={`text-xs font-semibold ${styles.label} uppercase tracking-wider`}>
        {label}
      </label>

      {isEditing ? (
        <div className="mt-1">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {renderInput()}
            </div>
            <div className="flex items-center gap-1 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-1 flex items-center justify-between group">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {Icon && <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            <p className="text-base font-medium text-gray-900 truncate">{value || "-"}</p>
          </div>
          {editable && onSave && (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Non-editable wrapper that maintains the same interface as DataField
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
