"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Brain, Loader2, CheckCircle2, HelpCircle, AlertCircle,
  GraduationCap, MapPin, Star, Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { predictMerit } from "@/lib/ai";
import { getMeritFormulas, getSuggestedUniversities, calculateMerit } from "@/actions/merit";
import Link from "next/link";

interface MeritFormula {
  id: string;
  name: string;
  university: { name: string; slug: string };
  matricWeight: number;
  interWeight: number;
  entryTestWeight: number;
  description: string | null;
}

interface SuggestedProgram {
  id: string;
  name: string;
  slug: string;
  degreeLevel: string;
  field: string;
  minAggregate: number | null;
  university: { name: string; slug: string; city: string; province: string; type: string; ranking: number | null };
}

interface AiPrediction {
  probability: string;
  confidence: string;
  explanation: string;
  programs: string[];
}

const DEFAULT_FORMULAS: Record<string, { label: string; matric: number; inter: number; test: number }> = {
  engineering: { label: "Engineering (Default)", matric: 0.1, inter: 0.4, test: 0.5 },
  medical: { label: "Medical (MDCAT)", matric: 0.1, inter: 0.4, test: 0.5 },
  general: { label: "General / Business", matric: 0.2, inter: 0.3, test: 0.5 },
};

export function MeritForm() {
  const [formulas, setFormulas] = useState<MeritFormula[]>([]);
  const [selectedFormula, setSelectedFormula] = useState("engineering");
  const [matric, setMatric] = useState("");
  const [intermediate, setIntermediate] = useState("");
  const [entryTest, setEntryTest] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<string[]>([]);
  const [formulaName, setFormulaName] = useState("");
  const [aiResult, setAiResult] = useState<AiPrediction | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedProgram[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getMeritFormulas().then(setFormulas);
  }, []);

  const calculate = useCallback(async () => {
    const m = parseFloat(matric);
    const i = parseFloat(intermediate);
    const t = parseFloat(entryTest);
    if (isNaN(m) || isNaN(i) || isNaN(t)) return;

    if (selectedFormula.startsWith("db_")) {
      const formulaId = selectedFormula.replace("db_", "");
      const res = await calculateMerit(m, i, t, formulaId);
      setResult(res.aggregate);
      setFormulaName(res.formulaName);
      setBreakdown(res.breakdown);
    } else {
      const f = DEFAULT_FORMULAS[selectedFormula];
      const aggregate = Math.round((m * f.matric + i * f.inter + t * f.test) * 100) / 100;
      setResult(aggregate);
      setFormulaName(f.label);
      setBreakdown([
        `Matric (${f.matric * 100}%): ${(m * f.matric).toFixed(2)}`,
        `Intermediate (${f.inter * 100}%): ${(i * f.inter).toFixed(2)}`,
        `Entry Test (${f.test * 100}%): ${(t * f.test).toFixed(2)}`,
      ]);
    }

    setAiResult(null);
    setShowSuggestions(true);
    const suggestions = await getSuggestedUniversities(result || 0);
    setSuggestions(suggestions);
  }, [matric, intermediate, entryTest, selectedFormula, result]);

  const handleAiPredict = async () => {
    const m = parseFloat(matric);
    const i = parseFloat(intermediate);
    const t = parseFloat(entryTest);
    if (isNaN(m) || isNaN(i) || isNaN(t)) return;
    setAiLoading(true);
    try {
      const res = await predictMerit({
        matric: m,
        inter: i,
        entryTest: t,
        formula: formulaName,
      });
      setAiResult(res);
    } catch {
      setAiResult({
        probability: "Error",
        confidence: "Low",
        explanation: "Could not connect to AI service. Please try again later.",
        programs: [],
      });
    } finally {
      setAiLoading(false);
    }
  };

  const probabilityColor =
    aiResult?.probability === "High"
      ? "text-emerald-600 dark:text-emerald-400"
      : aiResult?.probability === "Medium"
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const ProbabilityIcon =
    aiResult?.probability === "High"
      ? CheckCircle2
      : aiResult?.probability === "Medium"
        ? HelpCircle
        : AlertCircle;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="formula">Merit Formula</Label>
            <select
              id="formula"
              value={selectedFormula}
              onChange={(e) => setSelectedFormula(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <optgroup label="Standard Formulas">
                {Object.entries(DEFAULT_FORMULAS).map(([key, f]) => (
                  <option key={key} value={key}>{f.label}</option>
                ))}
              </optgroup>
              {formulas.length > 0 && (
                <optgroup label="University-Specific">
                  {formulas.map((f) => (
                    <option key={f.id} value={`db_${f.id}`}>
                      {f.name} — {f.university.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="matric">Matric Marks (out of 1100)</Label>
              <Input
                id="matric"
                type="number"
                placeholder="e.g. 950"
                value={matric}
                onChange={(e) => setMatric(e.target.value)}
                min={0}
                max={1100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inter">Intermediate Marks (out of 1100)</Label>
              <Input
                id="inter"
                type="number"
                placeholder="e.g. 850"
                value={intermediate}
                onChange={(e) => setIntermediate(e.target.value)}
                min={0}
                max={1100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryTest">Entry Test Marks (out of 100)</Label>
              <Input
                id="entryTest"
                type="number"
                placeholder="e.g. 75"
                value={entryTest}
                onChange={(e) => setEntryTest(e.target.value)}
                min={0}
                max={100}
              />
            </div>
          </div>

          <Button onClick={calculate} className="w-full" size="lg">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Aggregate
          </Button>
        </CardContent>
      </Card>

      {result !== null && (
        <Card>
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Your Calculated Aggregate</p>
            <p className="text-5xl font-bold text-secondary">{result}%</p>
            <p className="text-xs text-muted-foreground">Using: {formulaName}</p>
          </CardContent>
        </Card>
      )}

      {breakdown.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Calculation Breakdown</h3>
            <div className="space-y-2">
              {breakdown.map((line, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result !== null && (
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={handleAiPredict}
              disabled={aiLoading}
              className="w-full"
              variant="secondary"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  AI Predict Admission Chances
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {aiResult && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-center gap-2">
              <ProbabilityIcon className={`h-6 w-6 ${probabilityColor}`} />
              <span className={`text-lg font-semibold ${probabilityColor}`}>
                {aiResult.probability} Chance
              </span>
              <span className="text-sm text-muted-foreground">({aiResult.confidence})</span>
            </div>
            <p className="text-sm text-muted-foreground">{aiResult.explanation}</p>
          </CardContent>
        </Card>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Suggested Programs ({suggestions.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((p) => (
              <Link key={p.id} href={`/programs/${p.slug}`}>
                <Card className="group h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-foreground group-hover:text-secondary">
                        {p.name}
                      </p>
                      <Badge variant="outline" className="text-xs">{p.degreeLevel}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <GraduationCap className="h-3 w-3" />
                      {p.university.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {p.university.city}, {p.university.province}
                    </div>
                    <div className="flex items-center gap-2">
                      {p.minAggregate && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="mr-0.5 h-3 w-3" /> Min {p.minAggregate}%
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">{p.field}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && result !== null && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No matching programs found. Try a different formula or check your marks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
