"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DataTableSearchProps {
  initialValue?: string;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
  onDebouncedChange: (value: string) => void;
}

const DataTableSearch = ({
  initialValue = "",
  placeholder = "Search...",
  debounceMs = 700,
  isLoading,
  onDebouncedChange,
}: DataTableSearchProps) => {
  const [value, setValue] = useState(initialValue);
  const skipNextDebounceRef = useRef(false);

  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onDebouncedChange(value.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  const handleClear = () => {
    skipNextDebounceRef.current = true;
    setValue("");
    onDebouncedChange("");
  };

  return (
    <div className="relative w-full md:max-w-sm group">
      <Search className="text-white/30 group-focus-within:text-primary transition-colors absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-9 pr-9 pl-9 bg-white/[0.02] border-white/10 text-white placeholder:text-white/20 hover:border-white/20 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-300"
        disabled={isLoading}
      />

      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          onClick={handleClear}
          aria-label="Clear search"
          disabled={isLoading}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default DataTableSearch;
