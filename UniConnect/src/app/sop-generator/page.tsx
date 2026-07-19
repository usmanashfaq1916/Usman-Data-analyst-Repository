"use client";

import { useState } from "react";
import { FileText, Loader2, Copy, Check, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { generateSOP } from "@/lib/ai";
import { downloadAsPdf, downloadAsText } from "@/lib/pdf-export";

export default function SopGeneratorPage() {
  const [university, setUniversity] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [degree, setDegree] = useState("");
  const [studentProfile, setStudentProfile] = useState("");
  const [type, setType] = useState("statement_of_purpose");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!university || !degree || !studentProfile) return;
    setLoading(true);
    try {
      const res = await generateSOP({
        university,
        country,
        degree,
        studentProfile,
        type,
      });
      setContent(res.content);
      setWordCount(res.wordCount);
    } catch {
      setContent("Failed to generate SOP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">AI SOP Generator</h1>
        <p className="mt-2 text-muted-foreground">
          Generate a compelling Statement of Purpose for your university application
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Details</h2>
            <div className="space-y-2">
              <Label htmlFor="uni">Target University</Label>
              <Input id="uni" placeholder="e.g. NUST, LUMS" value={university} onChange={(e) => setUniversity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree Program</Label>
              <Input id="degree" placeholder="e.g. BS Computer Science" value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile">Your Profile (background, achievements, goals)</Label>
              <textarea
                id="profile"
                className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Describe your academic background, achievements, and career goals..."
                value={studentProfile}
                onChange={(e) => setStudentProfile(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Document Type</Label>
              <select
                id="type"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="statement_of_purpose">Statement of Purpose</option>
                <option value="personal_statement">Personal Statement</option>
                <option value="motivation_letter">Motivation Letter</option>
              </select>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate SOP
                </>
              )}
            </Button>
          </CardContent>
          </Card>
        </div>

        {content && (
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-secondary" />
                    <span className="font-semibold">Generated {type.replace(/_/g, " ")}</span>
                    <span className="text-sm text-muted-foreground">({wordCount} words)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => downloadAsPdf(content, `sop-${university.replace(/\s+/g, "-").toLowerCase()}`)}>
                      <Download className="mr-1 h-4 w-4" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadAsText(content, `sop-${university.replace(/\s+/g, "-").toLowerCase()}`)}>
                      <FileText className="mr-1 h-4 w-4" />
                      Text
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-lg bg-accent/50 p-4 text-sm leading-relaxed dark:prose-invert">
                  {content}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  );
}

