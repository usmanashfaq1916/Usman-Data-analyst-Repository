"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { CompareSelector } from "@/components/compare-selector";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SkeletonTable } from "@/components/shared/skeleton-card";

const CompareTable = lazy(() => import("@/components/compare-table").then(m => ({ default: m.CompareTable })));

interface University {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  type: string;
}

interface UniversityData extends University {
  ranking: number | null;
  websiteUrl: string | null;
  programCount: number;
  scholarshipCount: number;
  programs: { field: string; degreeLevel: string; minAggregate: number | null; semesterFee: number | null }[];
  scholarships: { name: string; type: string; amount: number | null }[];
  hostels: { name: string; type: string; fee: number | null }[];
}

export default function ComparePage() {
  const [selected, setSelected] = useState<University[]>([]);
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected.length === 0) {
      setUniversities([]);
      return;
    }

    async function fetchDetails() {
      setLoading(true);
      const ids = selected.map((u) => u.id).join(",");
      const res = await fetch(`/api/compare?ids=${ids}`);
      const data = await res.json();
      setUniversities(data.data || []);
      setLoading(false);
    }

    fetchDetails();
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Compare Universities</h1>
        <p className="mt-1 text-muted-foreground">
          Select up to 4 universities to compare side by side.
        </p>
      </div>

      <CompareSelector selected={selected} onChange={setSelected} max={4} />

      {selected.length >= 2 && (
        <div className="flex justify-end">
          <Link href={`/universities/${selected[0]?.slug}`}>
            <Button variant="outline" size="sm">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}

      {loading ? (
        <SkeletonTable />
      ) : (
        <Suspense fallback={<SkeletonTable />}>
          <CompareTable universities={universities} />
        </Suspense>
      )}
    </div>
  );
}
