"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  upvotes: number;
  isResolved: boolean;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
  _count: { answers: number };
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async (q?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const res = await fetch(`/api/community/questions?${params}`);
      const data = await res.json();
      setQuestions(data.data || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions(search);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Student Community</h1>
          <p className="mt-1 text-muted-foreground">Ask questions, share knowledge, and help each other</p>
        </div>
        {session && (
          <Button asChild>
            <Link href="/community/ask">
              <Plus className="mr-2 h-4 w-4" />
              Ask Question
            </Link>
          </Button>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="secondary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : questions.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No questions yet</h3>
          <p className="text-muted-foreground">Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Link key={q.id} href={`/community/question/${q.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <span className="text-lg font-bold">{q._count.answers}</span>
                    <span className="text-xs text-muted-foreground">answers</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{q.title}</h3>
                      {q.isResolved && <Badge variant="secondary" className="shrink-0">Resolved</Badge>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{q.content}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{q.author.name || "Anonymous"}</span>
                      <span>{formatDate(q.createdAt)}</span>
                      {q.tags && (
                        <div className="flex gap-1">
                          {q.tags.split(",").map((tag) => (
                            <Badge key={tag.trim()} variant="outline" className="text-xs">{tag.trim()}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
