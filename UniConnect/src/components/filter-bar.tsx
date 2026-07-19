"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  provinces: string[];
  cities: string[];
  degreeLevels: string[];
  currentProvince: string;
  currentCity: string;
  currentType: string;
  currentQuery: string;
  currentDegree: string;
  currentMinFee: string;
  currentMaxFee: string;
  currentHasHostel: string;
  currentHasScholarship: string;
}

export function FilterBar({
  provinces,
  cities,
  degreeLevels,
  currentProvince,
  currentCity,
  currentType,
  currentQuery,
  currentDegree,
  currentMinFee,
  currentMaxFee,
  currentHasHostel,
  currentHasScholarship,
}: FilterBarProps) {
  const router = useRouter();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams();
    if (currentProvince && key !== "province")
      params.set("province", currentProvince);
    if (currentCity && key !== "city") params.set("city", currentCity);
    if (currentType && key !== "type") params.set("type", currentType);
    if (currentQuery && key !== "q") params.set("q", currentQuery);
    if (currentDegree && key !== "degree") params.set("degree", currentDegree);
    if (currentMinFee && key !== "minFee") params.set("minFee", currentMinFee);
    if (currentMaxFee && key !== "maxFee") params.set("maxFee", currentMaxFee);
    if (currentHasHostel && key !== "hasHostel")
      params.set("hasHostel", currentHasHostel);
    if (currentHasScholarship && key !== "hasScholarship")
      params.set("hasScholarship", currentHasScholarship);
    if (value) params.set(key, value);
    const qs = params.toString();
    router.push(`/universities${qs ? `?${qs}` : ""}`);
  }

  const hasAnyFilter =
    currentProvince ||
    currentCity ||
    currentType ||
    currentQuery ||
    currentDegree ||
    currentMinFee ||
    currentMaxFee ||
    currentHasHostel ||
    currentHasScholarship;

  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name..."
          defaultValue={currentQuery}
          onChange={(e) => {
            const timeout = setTimeout(() => {
              updateFilter("q", e.target.value);
            }, 300);
            return () => clearTimeout(timeout);
          }}
          className="h-9 pl-9 text-sm"
        />
      </div>

      <select
        value={currentProvince}
        onChange={(e) => updateFilter("province", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Provinces</option>
        {provinces.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={currentCity}
        onChange={(e) => updateFilter("city", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={currentType}
        onChange={(e) => updateFilter("type", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Types</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
        <option value="Military">Military</option>
      </select>

      <select
        value={currentDegree}
        onChange={(e) => updateFilter("degree", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Degrees</option>
        {degreeLevels.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <input
          type="number"
          placeholder="Min Fee"
          defaultValue={currentMinFee}
          onChange={(e) => {
            const timeout = setTimeout(() => {
              updateFilter("minFee", e.target.value);
            }, 300);
            return () => clearTimeout(timeout);
          }}
          className="h-9 w-20 rounded-lg border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <span className="text-muted-foreground">-</span>
        <input
          type="number"
          placeholder="Max Fee"
          defaultValue={currentMaxFee}
          onChange={(e) => {
            const timeout = setTimeout(() => {
              updateFilter("maxFee", e.target.value);
            }, 300);
            return () => clearTimeout(timeout);
          }}
          className="h-9 w-20 rounded-lg border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      <label className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={currentHasHostel === "true"}
          onChange={(e) =>
            updateFilter("hasHostel", e.target.checked ? "true" : "")
          }
          className="h-4 w-4 rounded border-border accent-secondary"
        />
        Hostel
      </label>

      <label className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={currentHasScholarship === "true"}
          onChange={(e) =>
            updateFilter("hasScholarship", e.target.checked ? "true" : "")
          }
          className="h-4 w-4 rounded border-border accent-secondary"
        />
        Scholarships
      </label>

      {hasAnyFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/universities")}
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
