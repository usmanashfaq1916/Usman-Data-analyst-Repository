"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewUniversityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("PUBLIC");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [admissionUrl, setAdmissionUrl] = useState("");
  const [ranking, setRanking] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !province.trim() || !city.trim()) {
      setError("Name, province, and city are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, province, city, type, description, websiteUrl, admissionUrl, ranking, establishedYear, phone, email, isFeatured }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create university");
      }
      router.push("/admin/universities");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">New University</h1>
        <p className="text-sm text-muted-foreground">Add a new university to the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="MILITARY">Military</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province *</Label>
            <Input id="province" value={province} onChange={(e) => setProvince(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ranking">Ranking</Label>
            <Input id="ranking" type="number" value={ranking} onChange={(e) => setRanking(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Established Year</Label>
            <Input id="year" type="number" value={establishedYear} onChange={(e) => setEstablishedYear(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website URL</Label>
          <Input id="website" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admissionUrl">Admission URL</Label>
          <Input id="admissionUrl" value={admissionUrl} onChange={(e) => setAdmissionUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-secondary" />
          <Label htmlFor="isFeatured">Featured University</Label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create University"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/universities")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
