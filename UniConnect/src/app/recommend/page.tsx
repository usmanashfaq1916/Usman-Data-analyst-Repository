"use client";

import { useState } from "react";
import { Search, Loader2, GraduationCap, MapPin, DollarSign, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { recommendUniversities } from "@/lib/ai";

interface Recommendation {
  name: string;
  matchScore: number;
  reason: string;
}

export default function RecommendPage() {
  const [matric, setMatric] = useState("");
  const [inter, setInter] = useState("");
  const [entryTest, setEntryTest] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [preferredProgram, setPreferredProgram] = useState("");
  const [province, setProvince] = useState("");
  const [universityType, setUniversityType] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);

  const handleRecommend = async () => {
    const m = parseFloat(matric);
    const i = parseFloat(inter);
    const t = parseFloat(entryTest);
    if (isNaN(m) || isNaN(i) || isNaN(t)) return;
    setLoading(true);
    try {
      const res = await recommendUniversities({
        matric: m,
        inter: i,
        entryTest: t,
        budget: budget || undefined,
        city: city || undefined,
        preferredProgram: preferredProgram || undefined,
        province: province || undefined,
        universityType: universityType || undefined,
      });
      setResults(res.recommendations);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">AI University Recommender</h1>
        <p className="mt-2 text-muted-foreground">
          Get personalized university recommendations based on your profile
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Your Profile</h2>
            <div className="space-y-2">
              <Label htmlFor="matric">Matric / SSC (%)</Label>
              <Input id="matric" type="number" min="0" max="100" placeholder="e.g. 85" value={matric} onChange={(e) => setMatric(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inter">Intermediate / HSSC (%)</Label>
              <Input id="inter" type="number" min="0" max="100" placeholder="e.g. 78" value={inter} onChange={(e) => setInter(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryTest">Entry Test (%)</Label>
              <Input id="entryTest" type="number" min="0" max="100" placeholder="e.g. 70" value={entryTest} onChange={(e) => setEntryTest(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (per semester)</Label>
              <Input id="budget" placeholder="e.g. 50000" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Preferred City</Label>
              <Input id="city" placeholder="e.g. Lahore, Islamabad" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Preferred Program</Label>
              <Input id="program" placeholder="e.g. Computer Science, BBA" value={preferredProgram} onChange={(e) => setPreferredProgram(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input id="province" placeholder="e.g. Punjab, Sindh" value={province} onChange={(e) => setProvince(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uniType">University Type</Label>
              <Input id="uniType" placeholder="e.g. Public, Private" value={universityType} onChange={(e) => setUniversityType(e.target.value)} />
            </div>
            <Button onClick={handleRecommend} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {results && results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recommendations</h2>
              {results.map((rec, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{rec.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                        {rec.matchScore}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
