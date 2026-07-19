"use client";

import { Loader2, Brain, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { predictMerit } from "@/lib/ai";

interface Props {
  matric: number;
  inter: number;
  entryTest: number;
  formula: string;
}

export function MeritPredictionResult({ matric, inter, entryTest, formula }: Props) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Button
          onClick={async () => {
            const res = await predictMerit({ matric, inter, entryTest, formula });
            alert(`AI Prediction: ${res.probability} (${res.confidence})\n\n${res.explanation}`);
          }}
          className="w-full"
          variant="secondary"
        >
          <Brain className="mr-2 h-4 w-4" />
          AI Predict Chances
        </Button>
      </CardContent>
    </Card>
  );
}
