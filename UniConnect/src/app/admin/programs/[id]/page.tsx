"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function EditProgramPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", degreeLevel: "BS", field: "", description: "",
    duration: "", minAggregate: "", semesterFee: "", totalSeats: "", isAvailable: true,
  });

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      const res = await fetch(`/api/programs/${id}`);
      const data = await res.json();
      if (data.success) {
        const p = data.data;
        setForm({
          name: p.name || "", degreeLevel: p.degreeLevel || "BS", field: p.field || "",
          description: p.description || "", duration: p.duration?.toString() || "",
          minAggregate: p.minAggregate?.toString() || "", semesterFee: p.semesterFee?.toString() || "",
          totalSeats: p.totalSeats?.toString() || "", isAvailable: p.isAvailable ?? true,
        });
      }
    } catch {
      setError("Failed to load program");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push("/admin/programs");
    } catch {
      setError("Failed to update program");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Edit Program</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="degreeLevel">Degree Level</Label>
            <Select value={form.degreeLevel} onValueChange={(v) => setForm({ ...form, degreeLevel: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["BS","MS","PHD","MBA","MBBS","BDS","MPHIL","DIPLOMA","CERTIFICATE"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="field">Field</Label>
            <Input id="field" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (years)</Label>
            <Input id="duration" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minAggregate">Min Aggregate (%)</Label>
            <Input id="minAggregate" type="number" step="0.01" value={form.minAggregate} onChange={(e) => setForm({ ...form, minAggregate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="semesterFee">Semester Fee</Label>
            <Input id="semesterFee" type="number" value={form.semesterFee} onChange={(e) => setForm({ ...form, semesterFee: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalSeats">Total Seats</Label>
            <Input id="totalSeats" type="number" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isAvailable" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-secondary" />
          <Label htmlFor="isAvailable">Available</Label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/programs")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
