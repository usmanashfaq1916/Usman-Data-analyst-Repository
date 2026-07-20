"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SkeletonCard } from "@/components/shared/skeleton-card";

interface Answer {
  id: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
}

interface QuestionDetail {
  id: string;
  title: string;
  content: string;
  tags: string | null;
  upvotes: number;
  isResolved: boolean;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
  answers: Answer[];
  _count: { answers: number };
}

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community/questions/${id}`);
      const data = await res.json();
      setQuestion(data.data);
    } catch {
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/questions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent.trim() }),
      });
      if (res.ok) {
        setAnswerContent("");
        fetchQuestion();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
        <div className="space-y-2 mt-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Question not found</h2>
        <Button asChild className="mt-4">
          <Link href="/community">Back to Community</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/community" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </Link>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold">{question.title}</h1>
            {question.isResolved && <Badge variant="secondary">Resolved</Badge>}
          </div>
          <p className="mb-4 whitespace-pre-wrap text-muted-foreground">{question.content}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src={question.author.image || ""} />
              <AvatarFallback>{getInitials(question.author.name)}</AvatarFallback>
            </Avatar>
            <span>{question.author.name || "Anonymous"}</span>
            <span>{formatDate(question.createdAt)}</span>
            {question.tags?.split(",").map((tag) => (
              <Badge key={tag.trim()} variant="outline" className="text-xs">{tag.trim()}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-lg font-semibold">
        {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
      </h2>

      <div className="mb-8 space-y-4">
        {question.answers.map((answer) => (
          <Card key={answer.id} className={answer.isAccepted ? "border-green-500" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {answer.isAccepted && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />}
                <div className="flex-1">
                  <p className="mb-3 whitespace-pre-wrap">{answer.content}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={answer.author.image || ""} />
                      <AvatarFallback className="text-xs">{getInitials(answer.author.name)}</AvatarFallback>
                    </Avatar>
                    <span>{answer.author.name || "Anonymous"}</span>
                    <span>{formatDate(answer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {question.answers.length === 0 && (
          <p className="py-4 text-center text-muted-foreground">No answers yet. Be the first to answer!</p>
        )}
      </div>

      {session ? (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <Textarea
                rows={4}
                placeholder="Write your answer..."
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
              />
              <Button type="submit" disabled={submitting || !answerContent.trim()}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Answer"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">Sign in</Link> to answer this question
        </p>
      )}
    </div>
  );
}
