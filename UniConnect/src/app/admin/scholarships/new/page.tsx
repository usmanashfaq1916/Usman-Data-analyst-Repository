"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface University {
  id: string;
  name: string;
}

export default function NewScholarshipPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [universityId, setUniversityId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Merit Based");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [amountType, setAmountType] = useState("fixed");
  const [deadline, setDeadline] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [degreeLevel, setDegreeLevel] = useState("");
  const [isMeritBased, setIsMeritBased] = useState(false);
  const [isNeedBased, setIsNeedBased] = useState(false);
  const [officialUrl, setOfficialUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/universities?limit=500")
      .then((res) => res.json())
      .then((data) => setUniversities(data.data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!universityId || !name.trim()) {
      setError("University and name are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityId, name, type, description, amount, amountType, deadline, eligibility, country, degreeLevel, isMeritBased, isNeedBased, officialUrl }),
      });
      if (!res.ok) throw new Error("Failed to create scholarship");
      router.push("/admin/scholarships");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">New Scholarship</h1>
        <p className="text-sm text-muted-foreground">Add a new scholarship opportunity.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="university">University *</Label>
          <Select value={universityId} onValueChange={setUniversityId}>
            <SelectTrigger><SelectValue placeholder="Select university" /></SelectTrigger>
            <SelectContent>
              {universities.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Scholarship Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (PKR)</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amountType">Amount Type</Label>
            <Select value={amountType} onValueChange={setAmountType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="tuition">Tuition</SelectItem>
                <SelectItem value="stipend">Stipend</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="degreeLevel">Degree Level</Label>
            <Input id="degreeLevel" placeholder="e.g. BS, MS, PhD" value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="officialUrl">Official URL</Label>
          <Input id="officialUrl" value={officialUrl} onChange={(e) => setOfficialUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eligibility">Eligibility</Label>
          <Textarea id="eligibility" rows={3} value={eligibility} onChange={(e) => setEligibility(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isMeritBased" checked={isMeritBased} onChange={(e) => setIsMeritBased(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-secondary" />
            <Label htmlFor="isMeritBased">Merit Based</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isNeedBased" checked={isNeedBased} onChange={(e) => setIsNeedBased(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-secondary" />
            <Label htmlFor="isNeedBased">Need Based</Label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Scholarship"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/scholarships")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
