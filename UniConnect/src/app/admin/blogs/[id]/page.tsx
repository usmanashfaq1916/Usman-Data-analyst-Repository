"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonCard } from "@/components/shared/skeleton-card";

const CATEGORIES = ["ADMISSIONS", "SCHOLARSHIPS", "CAREER", "TECHNOLOGY", "STUDY_TIPS", "AI", "GENERAL"];

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "", coverUrl: "", category: "GENERAL", isPublished: false,
  });

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      if (data.blog) {
        setForm({
          title: data.blog.title || "", slug: data.blog.slug || "",
          content: data.blog.content || "", excerpt: data.blog.excerpt || "",
          coverUrl: data.blog.coverUrl || "", category: data.blog.category || "GENERAL",
          isPublished: data.blog.isPublished || false,
        });
      }
    } catch {
      setError("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push("/admin/blogs");
    } catch {
      setError("Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8"><SkeletonCard /></div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Edit Blog Post</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverUrl">Cover Image URL</Label>
          <Input id="coverUrl" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea id="content" rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-secondary" />
          <Label htmlFor="isPublished">Published</Label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blogs")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
