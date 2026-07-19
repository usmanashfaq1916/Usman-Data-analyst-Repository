"use client";

import { useState } from "react";
import { Loader2, GraduationCap, DollarSign, Globe, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { recommendScholarships } from "@/lib/ai";

interface Recommendation {
  name: string;
  matchScore: number;
  reason: string;
}

export default function ScholarshipRecommendPage() {
  const [matric, setMatric] = useState("");
  const [inter, setInter] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [financialStatus, setFinancialStatus] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");
  const [field, setField] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const res = await recommendScholarships({
        matric: matric ? parseFloat(matric) : undefined,
        inter: inter ? parseFloat(inter) : undefined,
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
        financialStatus: financialStatus || undefined,
        degreeLevel: degreeLevel || undefined,
        field: field || undefined,
        country: country || undefined,
        budget: budget || undefined,
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
        <h1 className="text-3xl font-bold text-primary">AI Scholarship Recommendation</h1>
        <p className="mt-2 text-muted-foreground">
          Find the best scholarships matching your academic and financial profile
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
              <Label htmlFor="cgpa">CGPA (if applicable)</Label>
              <Input id="cgpa" type="number" min="0" max="4" step="0.01" placeholder="e.g. 3.5" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financialStatus">Financial Status</Label>
              <Input id="financialStatus" placeholder="e.g. Low income, Middle class" value={financialStatus} onChange={(e) => setFinancialStatus(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degreeLevel">Degree Level</Label>
              <Select value={degreeLevel} onValueChange={setDegreeLevel}>
                <SelectTrigger id="degreeLevel">
                  <SelectValue placeholder="Select degree level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BS">BS / Bachelor</SelectItem>
                  <SelectItem value="MS">MS / Master</SelectItem>
                  <SelectItem value="PHD">PhD</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="MBBS">MBBS</SelectItem>
                  <SelectItem value="MPHIL">MPhil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="field">Field of Study</Label>
              <Input id="field" placeholder="e.g. Computer Science, Medicine" value={field} onChange={(e) => setField(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Preferred Country</Label>
              <Input id="country" placeholder="e.g. Pakistan, USA, UK" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget / Tuition Range</Label>
              <Input id="budget" placeholder="e.g. Under PKR 100,000/semester" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <Button onClick={handleRecommend} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Scholarships...
                </>
              ) : (
                <>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Find Scholarships
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {results && results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recommended Scholarships</h2>
              {results.map((rec, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{rec.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                      <div className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-600">
                        {rec.matchScore}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {results && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No recommendations found. Try different criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
