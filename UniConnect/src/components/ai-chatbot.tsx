"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/chat-message";
import { sendChatMessage } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  "Tell me about NUST programs",
  "What scholarships are available?",
  "How to calculate merit for UET?",
  "When do admissions open?",
  "Best universities for Computer Science in Pakistan",
  "What documents are needed for university admission?",
  "Compare LUMS and NUST",
  "HEC scholarship programs 2026",
];

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to **UniGuide AI**! I'm your admission counselor. To give you personalized recommendations, could you tell me about your academic background?\n\n- What qualification do you have? (FSC Pre Engineering, FSC Pre Medical, ICS, A Levels)\n- What are your marks?\n- Which field interests you? (Computer Science, Engineering, Medical, Business)\n- Which city?\n\nI'll then recommend universities, check admission chances, show fee comparisons, and guide you through the entire process.",
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
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 items-center justify-center gap-2 rounded-2xl bg-secondary px-4 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Toggle UniBot"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        <span className="text-sm font-medium">UniBot</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] flex-col rounded-2xl border border-border bg-white shadow-2xl dark:bg-card dark:text-card-foreground">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <MessageCircle className="h-5 w-5 text-secondary" />
            <span className="font-semibold">UniGuide AI</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {loading && <ChatMessage role="assistant" content="" loading />}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="rounded-full border border-border bg-accent/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-border p-3">
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
                placeholder="Ask about admissions..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
