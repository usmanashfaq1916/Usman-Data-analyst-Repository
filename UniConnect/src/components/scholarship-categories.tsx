"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Award, Landmark, BookOpen, Heart, Building2, Globe } from "lucide-react";

const CATEGORIES = [
  { value: "HEC", label: "HEC", icon: Award },
  { value: "Provincial", label: "Provincial", icon: Landmark },
  { value: "Merit", label: "Merit", icon: BookOpen },
  { value: "Need-Based", label: "Need", icon: Heart },
  { value: "University", label: "University", icon: Building2 },
  { value: "International", label: "International", icon: Globe },
];

export function ScholarshipCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("type") || "";

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("type") === value) {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`/scholarships${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Scholarship categories">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => handleClick(cat.value)}
            role="tab"
            aria-selected={isActive}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-secondary text-white shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
