"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, ExternalLink, Bed, Award, Heart, GitCompareArrows, BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UniversityWithMeta } from "@/lib/types";

const COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 0 && !["of", "the", "and", "&"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getAdmissionBadge(admissions?: { status: string }[]) {
  if (!admissions || admissions.length === 0) return null;
  const open = admissions.find((a) => a.status === "OPEN");
  const closing = admissions.find((a) => a.status === "CLOSING_SOON");
  const upcoming = admissions.find((a) => a.status === "UPCOMING");
  if (open) return { label: "Admissions Open", variant: "success" as const };
  if (closing) return { label: "Closing Soon", variant: "warning" as const };
  if (upcoming) return { label: "Opening Soon", variant: "secondary" as const };
  return null;
}

export function UniversityCard({
  university,
  index = 0,
}: {
  university: UniversityWithMeta;
  index?: number;
}) {
  const [saved, setSaved] = useState(false);
  const color = COLORS[index % COLORS.length];
  const admissionBadge = getAdmissionBadge(university.admissions);
  const isCompare = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("compare")?.split(",").includes(university.id);

  return (
    <Card className="group h-full transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${color}`}
          >
            {getInitials(university.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link href={`/universities/${university.slug}`}>
                <h3 className="truncate text-sm font-semibold text-foreground hover:text-secondary">
                  {university.name}
                </h3>
              </Link>
              {university.isHecRecognized !== false && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300">
                  HEC
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {university.city}, {university.province}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
              className={`rounded-full p-1.5 transition-colors ${saved ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"}`}
              aria-label={saved ? "Unsave university" : "Save university"}
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
            <Link href={`/compare?ids=${university.id}`}>
              <button
                className={`rounded-full p-1.5 transition-colors ${isCompare ? "text-secondary bg-blue-50 dark:bg-blue-900/20" : "text-muted-foreground hover:text-secondary hover:bg-blue-50"}`}
                aria-label="Compare university"
              >
                <GitCompareArrows className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="text-xs">
            {university.type === "PUBLIC" ? "Public" : university.type === "PRIVATE" ? "Private" : "Military"}
          </Badge>
          {university.ranking && (
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
              <Star className="mr-0.5 h-3 w-3" /> #{university.ranking}
            </Badge>
          )}
          {admissionBadge && (
            <Badge variant={admissionBadge.variant} className="text-xs">
              {admissionBadge.label}
            </Badge>
          )}
          {university.programCount !== undefined && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              {university.programCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {university.hostels && university.hostels.length > 0 && (
            <span className="flex items-center gap-1" title="Hostel available">
              <Bed className="h-3 w-3 text-secondary" /> Hostel
            </span>
          )}
          {university.scholarships && university.scholarships.length > 0 && (
            <span className="flex items-center gap-1" title="Scholarships available">
              <Award className="h-3 w-3 text-secondary" /> Scholarships
            </span>
          )}
        </div>

        {university.websiteUrl && (
          <a
            href={university.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary"
          >
            <ExternalLink className="h-3 w-3" />
            Visit website
          </a>
        )}
      </CardContent>
    </Card>
  );
}
