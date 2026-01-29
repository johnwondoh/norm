"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
  showIcon?: boolean;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  showIcon = false,
  className,
}: FilterDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-11 px-4 bg-white border-slate-200 hover:bg-slate-50 rounded-full",
            className
          )}
        >
          {showIcon && <Filter className="h-4 w-4 mr-2 text-slate-400" />}
          <span className="text-slate-700">{displayLabel}</span>
          <ChevronDown className="h-4 w-4 ml-2 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange?.(option.value)}
            className={cn(
              "cursor-pointer",
              value === option.value && "bg-slate-100"
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FilterDropdown;
