"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function EditUniversityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", province: "", city: "", type: "PUBLIC", description: "",
    websiteUrl: "", admissionUrl: "", ranking: "", establishedYear: "", phone: "", email: "",
    isFeatured: false, isActive: true,
  });

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  const fetchUniversity = async () => {
    try {
      const res = await fetch(`/api/universities/${id}`);
      const data = await res.json();
      if (data.success) {
        const u = data.data;
        setForm({
          name: u.name || "", province: u.province || "", city: u.city || "", type: u.type || "PUBLIC",
          description: u.description || "", websiteUrl: u.websiteUrl || "", admissionUrl: u.admissionUrl || "",
          ranking: u.ranking?.toString() || "", establishedYear: u.establishedYear?.toString() || "",
          phone: u.phone || "", email: u.email || "", isFeatured: u.isFeatured || false, isActive: u.isActive ?? true,
        });
      }
    } catch {
      setError("Failed to load university");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/universities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push("/admin/universities");
    } catch {
      setError("Failed to update university");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Edit University</h1>
        <p className="text-sm text-muted-foreground">Update university information.</p>
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
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="MILITARY">Military</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Input id="province" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ranking">Ranking</Label>
            <Input id="ranking" type="number" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Established Year</Label>
            <Input id="year" type="number" value={form.establishedYear} onChange={(e) => setForm({ ...form, establishedYear: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admissionUrl">Admission URL</Label>
          <Input id="admissionUrl" value={form.admissionUrl} onChange={(e) => setForm({ ...form, admissionUrl: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-secondary" />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-secondary" />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/universities")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
