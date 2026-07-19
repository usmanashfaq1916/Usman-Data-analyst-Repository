"use client";

import { useState } from "react";
import { FileText, Loader2, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { generateResume } from "@/lib/ai";
import { downloadAsPdf, downloadAsText } from "@/lib/pdf-export";

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [experience, setExperience] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    suggestedSkills: string[];
    projectDescriptions: string[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!name || !education || !targetRole) return;
    setLoading(true);
    try {
      const res = await generateResume({
        name,
        education,
        skills,
        projects,
        experience,
        targetRole,
      });
      setResult(res);
    } catch {
      setResult({
        summary: "Failed to generate. Please try again.",
        suggestedSkills: [],
        projectDescriptions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const resumeText = result
    ? `Resume - ${name}\nTarget Role: ${targetRole}\n\nProfessional Summary:\n${result.summary}\n\nSuggested Skills:\n${result.suggestedSkills.join(", ")}\n\nProjects & Experience:\n${result.projectDescriptions.join("\n")}`
    : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">AI Resume Builder</h1>
        <p className="mt-2 text-muted-foreground">
          Build an ATS-friendly resume with AI-powered suggestions
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Your Details</h2>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="e.g. Ahmad Khan" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <textarea id="education" className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" placeholder="Your educational background..." value={education} onChange={(e) => setEducation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <textarea id="skills" className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" placeholder="Your current skills..." value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projects">Projects</Label>
              <textarea id="projects" className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" placeholder="Describe your projects..." value={projects} onChange={(e) => setProjects(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <textarea id="experience" className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" placeholder="Your work experience..." value={experience} onChange={(e) => setExperience(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Target Role</Label>
              <Input id="role" placeholder="e.g. Software Engineer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><FileText className="mr-2 h-4 w-4" /> Build Resume</>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => downloadAsPdf(resumeText, `resume-${name.replace(/\s+/g, "-").toLowerCase()}`)}>
                <Download className="mr-1 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadAsText(resumeText, `resume-${name.replace(/\s+/g, "-").toLowerCase()}`)}>
                <FileText className="mr-1 h-4 w-4" /> Text
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">Professional Summary</h3>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
              </CardContent>
            </Card>
            {result.suggestedSkills.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">Suggested Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedSkills.map((skill, i) => (
                      <span key={i} className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">{skill}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {result.projectDescriptions.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">AI Suggestions</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {result.projectDescriptions.map((desc, i) => (
                      <p key={i}>{desc}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
