"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function EditScholarshipPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", type: "Merit Based", description: "", amount: "", amountType: "fixed",
    deadline: "", eligibility: "", country: "Pakistan", degreeLevel: "",
    isMeritBased: false, isNeedBased: false, officialUrl: "", isActive: true,
  });

  useEffect(() => {
    fetchScholarship();
  }, [id]);

  const fetchScholarship = async () => {
    try {
      const res = await fetch(`/api/scholarships/${id}`);
      const data = await res.json();
      if (data.success) {
        const s = data.data;
        setForm({
          name: s.name || "", type: s.type || "Merit Based", description: s.description || "",
          amount: s.amount?.toString() || "", amountType: s.amountType || "fixed",
          deadline: s.deadline ? new Date(s.deadline).toISOString().split("T")[0] : "",
          eligibility: s.eligibility || "", country: s.country || "Pakistan",
          degreeLevel: s.degreeLevel || "", isMeritBased: s.isMeritBased || false,
          isNeedBased: s.isNeedBased || false, officialUrl: s.officialUrl || "",
          isActive: s.isActive ?? true,
        });
      }
    } catch {
      setError("Failed to load scholarship");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/scholarships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push("/admin/scholarships");
    } catch {
      setError("Failed to update scholarship");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Edit Scholarship</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (PKR)</Label>
            <Input id="amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amountType">Amount Type</Label>
            <Select value={form.amountType} onValueChange={(v) => setForm({ ...form, amountType: v })}>
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
            <Input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="degreeLevel">Degree Level</Label>
            <Input id="degreeLevel" value={form.degreeLevel} onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="officialUrl">Official URL</Label>
            <Input id="officialUrl" value={form.officialUrl} onChange={(e) => setForm({ ...form, officialUrl: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="eligibility">Eligibility</Label>
          <Textarea id="eligibility" rows={3} value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isMeritBased" checked={form.isMeritBased} onChange={(e) => setForm({ ...form, isMeritBased: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-secondary" />
            <Label htmlFor="isMeritBased">Merit Based</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isNeedBased" checked={form.isNeedBased} onChange={(e) => setForm({ ...form, isNeedBased: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-secondary" />
            <Label htmlFor="isNeedBased">Need Based</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-secondary" />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/scholarships")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
