"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ScholarshipFilterBarProps {
  types: string[];
  degrees: string[];
  countries: string[];
  provinces: string[];
  currentQuery: string;
  currentType: string;
  currentDegree: string;
  currentCountry: string;
  currentGender: string;
  currentMinCgpa: string;
  currentProvince: string;
}

export function ScholarshipFilterBar({
  types,
  degrees,
  countries,
  provinces,
  currentQuery,
  currentType,
  currentDegree,
  currentCountry,
  currentGender,
  currentMinCgpa,
  currentProvince,
}: ScholarshipFilterBarProps) {
  const router = useRouter();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams();
    if (currentQuery && key !== "q") params.set("q", currentQuery);
    if (currentType && key !== "type") params.set("type", currentType);
    if (currentDegree && key !== "degree") params.set("degree", currentDegree);
    if (currentCountry && key !== "country") params.set("country", currentCountry);
    if (currentGender && key !== "gender") params.set("gender", currentGender);
    if (currentMinCgpa && key !== "minCgpa") params.set("minCgpa", currentMinCgpa);
    if (currentProvince && key !== "province") params.set("province", currentProvince);
    if (value) params.set(key, value);
    const qs = params.toString();
    router.push(`/scholarships${qs ? `?${qs}` : ""}`);
  }

  const hasFilters = currentQuery || currentType || currentDegree || currentCountry || currentGender || currentMinCgpa || currentProvince;

  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search scholarships..."
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
        value={currentType}
        onChange={(e) => updateFilter("type", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Types</option>
        {types.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <select
        value={currentDegree}
        onChange={(e) => updateFilter("degree", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Degrees</option>
        {degrees.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        value={currentProvince}
        onChange={(e) => updateFilter("province", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Provinces</option>
        {provinces.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <select
        value={currentGender}
        onChange={(e) => updateFilter("gender", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Both">Both</option>
      </select>
      <input
        type="number"
        step="0.1"
        placeholder="Min CGPA"
        defaultValue={currentMinCgpa}
        onChange={(e) => {
          const timeout = setTimeout(() => {
            updateFilter("minCgpa", e.target.value);
          }, 300);
          return () => clearTimeout(timeout);
        }}
        className="h-9 w-24 rounded-lg border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      />
      <select
        value={currentCountry}
        onChange={(e) => updateFilter("country", e.target.value)}
        className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/scholarships")}
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
