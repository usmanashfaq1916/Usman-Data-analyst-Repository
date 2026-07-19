"use client";

import { useState } from "react";
import { Loader2, Briefcase, BookOpen, TrendingUp, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateCareerRoadmap } from "@/lib/ai";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

export default function CareerPage() {
  const [careerGoal, setCareerGoal] = useState("");
  const [currentEducation, setCurrentEducation] = useState("");
  const [field, setField] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!careerGoal.trim()) return;
    setLoading(true);
    try {
      const res = await generateCareerRoadmap({
        careerGoal,
        currentEducation: currentEducation || undefined,
        field: field || undefined,
        skills: skills || undefined,
        experience: experience || undefined,
        preferredCity: preferredCity || undefined,
      });
      setResult(res.roadmap);
    } catch {
      setResult("Failed to generate career roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">AI Career Guidance</h1>
        <p className="mt-2 text-muted-foreground">
          Get a personalized career roadmap with skills, resources, and job market insights
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Your Profile</h2>
            <div className="space-y-2">
              <Label htmlFor="careerGoal">Career Goal *</Label>
              <Input id="careerGoal" placeholder="e.g. Software Engineer, Data Scientist" value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Current Education</Label>
              <Input id="education" placeholder="e.g. BS Computer Science (2nd year)" value={currentEducation} onChange={(e) => setCurrentEducation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field">Field of Interest</Label>
              <Input id="field" placeholder="e.g. Artificial Intelligence, Finance" value={field} onChange={(e) => setField(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Current Skills</Label>
              <Textarea id="skills" placeholder="e.g. Python, Communication, Problem-solving" value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input id="experience" placeholder="e.g. 1 year internship, fresh graduate" value={experience} onChange={(e) => setExperience(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Preferred City</Label>
              <Input id="city" placeholder="e.g. Lahore, Karachi, Islamabad" value={preferredCity} onChange={(e) => setPreferredCity(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={loading || !careerGoal.trim()} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Generate Career Roadmap
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading && (
            <Card>
              <CardContent className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          )}
          {result && !loading && (
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Your Career Roadmap</h2>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <MarkdownRenderer content={result} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
