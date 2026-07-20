"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProgramFiltersProps {
  q: string;
  fieldFilter: string;
  degreeFilter: string;
  fields: string[];
  degreeLevels: string[];
}

export function ProgramFilters({
  q,
  fieldFilter,
  degreeFilter,
  fields,
  degreeLevels,
}: ProgramFiltersProps) {
  const router = useRouter();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams();
    if (q && key !== "q") params.set("q", q);
    if (fieldFilter && key !== "field") params.set("field", fieldFilter);
    if (degreeFilter && key !== "degree") params.set("degree", degreeFilter);
    if (value) params.set(key, value);
    const qs = params.toString();
    router.push(`/programs${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
      <div className="relative flex-1 min-w-[200px]">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const val = (formData.get("q") as string) || "";
            updateFilter("q", val);
          }}
        >
          <Input
            name="q"
            placeholder="Search programs..."
            defaultValue={q}
            className="h-9 pl-9 text-sm"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
      <select
        value={fieldFilter}
        onChange={(e) => updateFilter("field", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Fields</option>
        {fields.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <select
        value={degreeFilter}
        onChange={(e) => updateFilter("degree", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Levels</option>
        {degreeLevels.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}
