"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, GraduationCap, BookOpen, Calculator, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/chat-message";
import { sendChatMessage } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  { label: "University Programs", icon: GraduationCap, query: "List top universities in Pakistan and their best programs" },
  { label: "Scholarships", icon: BookOpen, query: "What scholarships are available for Pakistani students in 2026?" },
  { label: "Merit Calculator", icon: Calculator, query: "How do I calculate my aggregate for NUST and UET?" },
  { label: "Admission Dates", icon: CalendarDays, query: "When do university admissions open and close in Pakistan?" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to **UniConnect AI Chat**! 🎓\n\nI'm trained on the complete UniConnect database with **259 Pakistani universities**, their programs, scholarships, and admission details.\n\n**I can help you with:**\n- Finding the right university and program\n- Scholarship opportunities and eligibility\n- Merit calculation and aggregate formulas\n- Admission deadlines and requirements\n- Career guidance and study abroad info\n\nChoose a topic below or type your question!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (msg?: string) => {
    const userMsg = msg || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const reply = await sendChatMessage(userMsg, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting to the AI service. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">UniConnect AI Chat</h1>
        <p className="mt-2 text-muted-foreground">
          Ask anything about Pakistani university admissions, scholarships, and programs
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => handleSend(s.query)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-accent/30 p-3 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <s.icon className="h-5 w-5 text-secondary" />
            <span className="font-medium">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="flex h-[600px] flex-col rounded-2xl border border-border bg-white shadow-lg dark:bg-card">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <Sparkles className="h-5 w-5 text-secondary" />
          <span className="font-semibold">UniConnect AI Assistant</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && <ChatMessage role="assistant" content="" loading />}
          {!loading && messages.length === 1 && (
            <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              <Sparkles className="mx-auto mb-2 h-5 w-5 text-secondary" />
              <p>Try one of the topic buttons above or type your question below!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about admissions, scholarships, programs..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
