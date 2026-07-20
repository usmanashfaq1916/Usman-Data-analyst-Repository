"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Award, Landmark, BookOpen, Heart, Building2, Globe } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  function handleValueChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("type") === value || !value) {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`/scholarships${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <Tabs value={active} onValueChange={handleValueChange} className="w-full">
      <TabsList className="h-auto flex-wrap gap-1 p-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <TabsTrigger key={cat.value} value={cat.value} className="gap-1.5 text-xs data-[state=active]:shadow-sm">
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
