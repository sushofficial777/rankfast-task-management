
'use client';

import React from 'react';
import { Calendar } from "@/components/ui/calendar"; 
import { cn } from "@/lib/utils"; 

interface DatePickerProps {
  className?: string;
  onSelect: (date: Date | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ className = '', onSelect, open, setOpen }) => {
  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className={cn("w-fit h-fit bg-white rounded-xl shadow-lg ", className)}>
      <Calendar
        mode="single"
        selected={undefined}
        onSelect={handleSelect}
        initialFocus
      />
    </div>
  );
};

export default DatePicker;
