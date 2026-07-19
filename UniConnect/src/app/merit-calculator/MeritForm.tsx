"use client";

import { useState } from "react";
import { Brain, Loader2, CheckCircle2, HelpCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { predictMerit } from "@/lib/ai";

const FORMULAS = {
  engineering: { label: "Engineering", matric: 0.1, inter: 0.4, test: 0.5 },
  medical: { label: "Medical (MDCAT)", matric: 0.1, inter: 0.4, test: 0.5 },
  general: { label: "General / Business", matric: 0.2, inter: 0.3, test: 0.5 },
};

type FormulaKey = keyof typeof FORMULAS;

interface AiPrediction {
  probability: string;
  confidence: string;
  explanation: string;
  programs: string[];
}

export function MeritForm() {
  const [formula, setFormula] = useState<FormulaKey>("engineering");
  const [matric, setMatric] = useState("");
  const [intermediate, setIntermediate] = useState("");
  const [entryTest, setEntryTest] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [aiResult, setAiResult] = useState<AiPrediction | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
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
    setAiResult(null);
  }

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
        formula: FORMULAS[formula].label,
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
      ? "text-green-600 dark:text-green-400"
      : aiResult?.probability === "Medium"
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  const ProbabilityIcon =
    aiResult?.probability === "High"
      ? CheckCircle2
      : aiResult?.probability === "Medium"
        ? HelpCircle
        : AlertCircle;

  return (
    <div className="space-y-4">
      {result !== null && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Your Aggregate</p>
            <p className="text-4xl font-bold text-secondary">{result}%</p>
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
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  AI Predict Chances
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
    </div>
  );
}
