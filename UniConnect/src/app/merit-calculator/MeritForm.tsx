"use client";

import { useState } from "react";
import { Calculator, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Formula = "engineering" | "medical" | "general";

interface UniversityResult {
  name: string;
  slug: string;
  program: string;
  minAggregate: number;
}

const FORMULAS: Record<Formula, { label: string; w1: number; w2: number; w3: number }> = {
  engineering: { label: "Engineering", w1: 0.1, w2: 0.4, w3: 0.5 },
  medical: { label: "Medical (MDCAT)", w1: 0.1, w2: 0.4, w3: 0.5 },
  general: { label: "General / Business", w1: 0.2, w2: 0.4, w3: 0.4 },
};

export function MeritForm({
  universities,
}: {
  universities: UniversityResult[];
}) {
  const [matric, setMatric] = useState("");
  const [intermediate, setIntermediate] = useState("");
  const [testScore, setTestScore] = useState("");
  const [formula, setFormula] = useState<Formula>("general");
  const [result, setResult] = useState<{
    aggregate: number;
    band: string;
    recommendations: UniversityResult[];
  } | null>(null);

  function calculate() {
    const m = parseFloat(matric);
    const i = parseFloat(intermediate);
    const t = parseFloat(testScore);

    if (isNaN(m) || isNaN(i) || isNaN(t)) return;

    const f = FORMULAS[formula];
    const aggregate = m * f.w1 + i * f.w2 + t * f.w3;

    let band: string;
    if (aggregate > 75) band = "High";
    else if (aggregate >= 60) band = "Medium";
    else band = "Low";

    const recommendations = universities.filter(
      (u) => u.minAggregate <= aggregate,
    );

    setResult({ aggregate: Math.round(aggregate * 100) / 100, band, recommendations });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-primary">
            Enter Your Marks
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(
              Object.entries(FORMULAS) as [Formula, typeof FORMULAS[Formula]][]
            ).map(([key, f]) => (
              <Button
                key={key}
                type="button"
                variant={formula === key ? "primary" : "outline"}
                size="sm"
                onClick={() => setFormula(key)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          <Input
            label="Matric / SSC (%)"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 85"
            value={matric}
            onChange={(e) => setMatric(e.target.value)}
          />
          <Input
            label="Intermediate / HSSC (%)"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 78"
            value={intermediate}
            onChange={(e) => setIntermediate(e.target.value)}
          />
          <Input
            label="Entry Test / MDCAT (%)"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 72"
            value={testScore}
            onChange={(e) => setTestScore(e.target.value)}
          />

          <Button
            onClick={calculate}
            className="w-full"
            disabled={
              !matric || !intermediate || !testScore
            }
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Merit
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-primary">Your Result</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/5 p-4">
              <Award className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  {result.aggregate}%
                </p>
                <Badge
                  variant={
                    result.band === "High"
                      ? "open"
                      : result.band === "Medium"
                        ? "closing_soon"
                        : "closed"
                  }
                >
                  {result.band} Chance
                </Badge>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-primary">
                Recommended Programs ({result.recommendations.length})
              </p>
              {result.recommendations.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No programs match your aggregate. Try a different formula or
                  improve your scores.
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {result.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border p-3 text-sm"
                    >
                      <p className="font-medium text-primary">{rec.name}</p>
                      <p className="text-xs text-gray-500">
                        {rec.program} &mdash; Min. {rec.minAggregate}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
