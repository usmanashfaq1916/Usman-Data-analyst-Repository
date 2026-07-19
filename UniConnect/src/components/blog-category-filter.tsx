"use client";

import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "ADMISSIONS", label: "Admissions" },
  { value: "SCHOLARSHIPS", label: "Scholarships" },
  { value: "CAREER", label: "Career" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "STUDY_TIPS", label: "Study Tips" },
  { value: "AI", label: "AI" },
  { value: "GENERAL", label: "General" },
];

export function BlogCategoryFilter() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = cat.value === activeCategory;
        return (
          <a
            key={cat.value}
            href={cat.value ? `/blog?category=${cat.value}` : "/blog"}
            className={`rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-secondary text-white"
                : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {cat.label}
          </a>
        );
      })}
    </div>
  );
}
