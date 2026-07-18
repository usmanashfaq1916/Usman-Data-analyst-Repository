"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface University {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  type: string;
}

interface CompareSelectorProps {
  selected: University[];
  onChange: (universities: University[]) => void;
  max?: number;
}

export function CompareSelector({ selected, onChange, max = 4 }: CompareSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<University[]>([]);
  const [open, setOpen] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    const res = await fetch(`/api/universities?q=${encodeURIComponent(q)}&limit=10`);
    const data = await res.json();
    setResults(data.data || []);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 300);
    return () => clearTimeout(timeout);
  }, [query, search]);

  function add(university: University) {
    if (selected.length >= max) return;
    if (selected.some((u) => u.id === university.id)) return;
    onChange([...selected, university]);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function remove(id: string) {
    onChange(selected.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search universities to compare..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="pl-9"
        />
        {open && results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
            {results.map((u) => (
              <button
                key={u.id}
                onClick={() => add(u)}
                disabled={selected.some((s) => s.id === u.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent disabled:opacity-50"
              >
                <Plus className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{u.name}</span>
                <span className="text-xs text-muted-foreground">{u.city}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {selected.map((u) => (
          <Badge key={u.id} variant="secondary" className="flex items-center gap-1">
            {u.name}
            <button onClick={() => remove(u.id)} className="ml-1 hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selected.length < max && (
          <span className="text-xs text-muted-foreground self-center">
            Add {max - selected.length} more
          </span>
        )}
      </div>
    </div>
  );
}
