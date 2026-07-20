"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { ExternalLink, FileDown } from "lucide-react";
import { downloadAsText } from "@/lib/pdf-export";

interface UniversityData {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  type: string;
  ranking: number | null;
  websiteUrl: string | null;
  programCount: number;
  scholarshipCount: number;
  programs: { field: string; degreeLevel: string; minAggregate: number | null; semesterFee: number | null }[];
  scholarships: { name: string; type: string; amount: number | null }[];
  hostels: { name: string; type: string; fee: number | null }[];
}

interface CompareTableProps {
  universities: UniversityData[];
}

function formatArray(items: string[]): string {
  if (items.length === 0) return "N/A";
  if (items.length <= 3) return items.join(", ");
  return `${items.slice(0, 3).join(", ")} +${items.length - 3} more`;
}

const ROWS = [
  { label: "Location", getValue: (u: UniversityData) => `${u.city}, ${u.province}` },
  { label: "Type", getValue: (u: UniversityData) => u.type },
  { label: "Ranking", getValue: (u: UniversityData) => u.ranking ? `#${u.ranking}` : "Not ranked" },
  { label: "Total Programs", getValue: (u: UniversityData) => `${u.programCount}` },
  { label: "Scholarships", getValue: (u: UniversityData) => `${u.scholarshipCount}` },
  { label: "Programs Offered", getValue: (u: UniversityData) => {
    const fields = [...new Set(u.programs.map(p => p.field))];
    return formatArray(fields);
  }},
  { label: "Degree Levels", getValue: (u: UniversityData) => {
    const levels = [...new Set(u.programs.map(p => p.degreeLevel))];
    return formatArray(levels);
  }},
  { label: "Fee Range", getValue: (u: UniversityData) => {
    const fees = u.programs.filter(p => p.semesterFee).map(p => p.semesterFee!);
    if (fees.length === 0) return "N/A";
    const min = Math.min(...fees);
    const max = Math.max(...fees);
    return min === max ? `PKR ${min.toLocaleString()}` : `PKR ${min.toLocaleString()} - ${max.toLocaleString()}`;
  }},
  { label: "Min Aggregate", getValue: (u: UniversityData) => {
    const aggregates = u.programs.filter(p => p.minAggregate).map(p => p.minAggregate!);
    if (aggregates.length === 0) return "N/A";
    return `${Math.min(...aggregates)}% - ${Math.max(...aggregates)}%`;
  }},
  { label: "Hostel", getValue: (u: UniversityData) => {
    if (u.hostels.length === 0) return "Not available";
    return u.hostels.map(h => h.name).join(", ");
  }},
  { label: "Scholarship Types", getValue: (u: UniversityData) => {
    const types = [...new Set(u.scholarships.map(s => s.type))];
    return types.length > 0 ? formatArray(types) : "N/A";
  }},
  { label: "Research Output", getValue: (_u: UniversityData) => "Available on profile" },
  { label: "Campus Facilities", getValue: (u: UniversityData) => {
    const facilities: string[] = [];
    if (u.hostels.length > 0) facilities.push("Hostel");
    if (u.scholarships.length > 0) facilities.push("Scholarships");
    if (facilities.length === 0) return "See details";
    return facilities.join(", ");
  }},
];

export function CompareTable({ universities }: CompareTableProps) {
  if (universities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
        <p className="text-lg font-medium">No universities selected</p>
        <p className="text-sm">Search and add universities above to compare them side by side.</p>
      </div>
    );
  }

  function handleExport() {
    let text = "University Comparison - UniConnect Pakistan\n\n";
    universities.forEach((u) => {
      text += `${"=".repeat(40)}\n`;
      text += `${u.name}\n`;
      text += `${"=".repeat(40)}\n`;
      ROWS.forEach((row) => {
        text += `${row.label}: ${row.getValue(u)}\n`;
      });
      text += "\n";
    });
    const name = universities.map((u) => u.name.replace(/\s+/g, "_")).join("_vs_");
    downloadAsText(text, `compare_${name}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDown className="mr-1.5 h-4 w-4" />
          Export Comparison
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-48 p-3 text-left text-sm font-semibold text-foreground border-b border-border" />
              {universities.map((u) => (
                <th key={u.id} className="p-3 text-center border-b border-border">
                  <div className="space-y-1">
                    <Link href={`/universities/${u.slug}`} className="text-sm font-bold text-foreground hover:text-secondary">
                      {u.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{u.city}</p>
                    {u.websiteUrl && (
                      <a href={u.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-secondary hover:underline">
                        <ExternalLink className="h-3 w-3" /> Website
                      </a>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-border">
                <td className="p-3 text-sm font-medium text-foreground">{row.label}</td>
                {universities.map((u) => (
                  <td key={u.id} className="p-3 text-center text-sm text-muted-foreground">
                    {row.getValue(u)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
