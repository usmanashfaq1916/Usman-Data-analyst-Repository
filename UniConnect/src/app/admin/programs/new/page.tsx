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

export default function NewProgramPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [universityId, setUniversityId] = useState("");
  const [name, setName] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("BS");
  const [field, setField] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [minAggregate, setMinAggregate] = useState("");
  const [semesterFee, setSemesterFee] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
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
    if (!universityId || !name.trim() || !field.trim()) {
      setError("University, name, and field are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityId, name, degreeLevel, field, description, duration, minAggregate, semesterFee, totalSeats }),
      });
      if (!res.ok) throw new Error("Failed to create program");
      router.push("/admin/programs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">New Program</h1>
        <p className="text-sm text-muted-foreground">Add a new academic program.</p>
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
            <Label htmlFor="name">Program Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="degreeLevel">Degree Level</Label>
            <Select value={degreeLevel} onValueChange={setDegreeLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BS">BS</SelectItem>
                <SelectItem value="MS">MS</SelectItem>
                <SelectItem value="PHD">PhD</SelectItem>
                <SelectItem value="MBA">MBA</SelectItem>
                <SelectItem value="MBBS">MBBS</SelectItem>
                <SelectItem value="BDS">BDS</SelectItem>
                <SelectItem value="MPHIL">MPhil</SelectItem>
                <SelectItem value="DIPLOMA">Diploma</SelectItem>
                <SelectItem value="CERTIFICATE">Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="field">Field *</Label>
            <Input id="field" value={field} onChange={(e) => setField(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (years)</Label>
            <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minAggregate">Min Aggregate (%)</Label>
            <Input id="minAggregate" type="number" step="0.01" value={minAggregate} onChange={(e) => setMinAggregate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semesterFee">Semester Fee (PKR)</Label>
            <Input id="semesterFee" type="number" value={semesterFee} onChange={(e) => setSemesterFee(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalSeats">Total Seats</Label>
            <Input id="totalSeats" type="number" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Program"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/programs")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
