
"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string;
}

interface GenericSelectProps {
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string;
}

const GenericSelect: React.FC<GenericSelectProps> = ({
  options,
  placeholder = "Select...",
  onSelect,
  className,
}) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default GenericSelect;
