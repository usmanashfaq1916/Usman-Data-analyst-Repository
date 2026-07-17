"use client";

import Link from "next/link";
import { Building2, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UniversityWithMeta } from "@/lib/types";

const COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
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

export function UniversityCard({
  university,
  index = 0,
}: {
  university: UniversityWithMeta;
  index?: number;
}) {
  const color = COLORS[index % COLORS.length];

  return (
    <Link href={`/universities/${university.slug}`}>
      <Card className="group h-full transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${color}`}
            >
              {getInitials(university.name)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-primary group-hover:text-secondary">
                {university.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {university.city}, {university.province}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                university.type === "Public" ? "Public" : "Private"
              }
            >
              {university.type}
            </Badge>
            {university.programCount !== undefined && (
              <span className="text-xs text-gray-500">
                {university.programCount} programs
              </span>
            )}
          </div>
          {university.websiteUrl && (
            <div
              className="flex items-center gap-1 text-xs text-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                window.open(university.websiteUrl!, "_blank");
              }}
            >
              <ExternalLink className="h-3 w-3" />
              Visit website
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
