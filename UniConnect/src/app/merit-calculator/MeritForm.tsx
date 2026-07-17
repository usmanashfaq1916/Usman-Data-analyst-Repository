"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const FORMULAS = {
  engineering: { label: "Engineering", matric: 0.1, inter: 0.4, test: 0.5 },
  medical: { label: "Medical (MDCAT)", matric: 0.1, inter: 0.4, test: 0.5 },
  general: { label: "General / Business", matric: 0.2, inter: 0.3, test: 0.5 },
};

type FormulaKey = keyof typeof FORMULAS;

export function MeritForm() {
  const [formula, setFormula] = useState<FormulaKey>("engineering");
  const [matric, setMatric] = useState("");
  const [intermediate, setIntermediate] = useState("");
  const [entryTest, setEntryTest] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<
    Array<{ name: string; university: string; slug: string }>
  >([]);

  function calculate() {
    const m = parseFloat(matric);
    const i = parseFloat(intermediate);
    const t = parseFloat(entryTest);
    if (isNaN(m) || isNaN(i) || isNaN(t)) return;

    const f = FORMULAS[formula];
    const aggregate = m * f.matric + i * f.inter + t * f.test;
    setResult(Math.round(aggregate * 100) / 100);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label>Formula Type</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(FORMULAS) as [FormulaKey, typeof FORMULAS[FormulaKey]][]).map(
                ([key, f]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={formula === key ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setFormula(key)}
                  >
                    {f.label}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matric">Matric / SSC (%)</Label>
            <Input
              id="matric"
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 85"
              value={matric}
              onChange={(e) => setMatric(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inter">Intermediate / HSSC (%)</Label>
            <Input
              id="inter"
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 78"
              value={intermediate}
              onChange={(e) => setIntermediate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="test">Entry Test / MDCAT (%)</Label>
            <Input
              id="test"
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 70"
              value={entryTest}
              onChange={(e) => setEntryTest(e.target.value)}
            />
          </div>

          <Button onClick={calculate} className="w-full" size="lg">
            Calculate Merit
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {result !== null && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Your Aggregate</p>
              <p className="text-4xl font-bold text-secondary">{result}%</p>
            </CardContent>
          </Card>
        )}

        {recommendations.length > 0 && (
          <Card>
            <CardContent className="space-y-3 p-6">
              <h3 className="font-semibold">Matching Programs</h3>
              {recommendations.map((r, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium">{r.name}</span> — {r.university}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
