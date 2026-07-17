"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  provinces: string[];
  currentProvince: string;
  currentCity: string;
  currentType: string;
  currentQuery: string;
}

export function FilterBar({
  provinces,
  currentProvince,
  currentCity,
  currentType,
  currentQuery,
}: FilterBarProps) {
  const router = useRouter();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams();
    if (currentProvince && key !== "province")
      params.set("province", currentProvince);
    if (currentCity && key !== "city") params.set("city", currentCity);
    if (currentType && key !== "type") params.set("type", currentType);
    if (currentQuery && key !== "q") params.set("q", currentQuery);
    if (value) params.set(key, value);
    const qs = params.toString();
    router.push(`/universities${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-white p-4">
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
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Provinces</option>
        {provinces.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={currentType}
        onChange={(e) => updateFilter("type", e.target.value)}
        className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All Types</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
        <option value="Military">Military</option>
      </select>

      {(currentProvince || currentCity || currentType || currentQuery) && (
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
