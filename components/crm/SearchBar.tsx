"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value = "",
  onChange,
  placeholder = "Search by name, email, or role...",
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 h-11 bg-white border-slate-200 rounded-full focus-visible:ring-blue-500"
      />
    </div>
  );
}

export default SearchBar;
