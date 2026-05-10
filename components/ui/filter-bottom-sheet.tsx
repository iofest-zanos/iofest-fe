"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Check } from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  selected: string;
  onSelect: (key: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export function FilterBottomSheet({
  open,
  onClose,
  title,
  options,
  selected,
  onSelect,
  showSearch = true,
  searchPlaceholder = "Cari...",
}: FilterBottomSheetProps) {
  const [query, setQuery] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener("click", handler), 100);
    return () => document.removeEventListener("click", handler);
  }, [open, onClose]);

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = (key: string) => {
    onSelect(key);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity flex items-end justify-center">
      <div
        ref={sheetRef}
        className="bg-card border border-border rounded-t-2xl shadow-2xl w-full max-w-lg max-h-[75vh] flex flex-col animate-slideInUp"
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors -mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="px-5 py-3 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Options list */}
        <div className="flex-1 overflow-y-auto overscroll-contain py-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">Tidak ditemukan</p>
          ) : (
            filtered.map((opt) => {
              const isSelected = opt.key === selected;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-left transition-colors hover:bg-muted/40 ${
                    isSelected ? "bg-primary/5 font-medium" : ""
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>
                  <span className="flex-1 text-foreground">{opt.label}</span>
                  {opt.count !== undefined && (
                    <span className="text-xs text-muted-foreground">{opt.count}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
