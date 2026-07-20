"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, GraduationCap, BookOpen, Calculator, CalendarDays, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/chat-message";
import { sendChatMessage } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SavedChat {
  id: string;
  title: string;
  updatedAt: string;
}

const SUGGESTIONS = [
  { label: "University Programs", icon: GraduationCap, query: "List top universities in Pakistan and their best programs" },
  { label: "Scholarships", icon: BookOpen, query: "What scholarships are available for Pakistani students in 2026?" },
  { label: "Merit Calculator", icon: Calculator, query: "How do I calculate my aggregate for NUST and UET?" },
  { label: "Admission Dates", icon: CalendarDays, query: "When do university admissions open and close in Pakistan?" },
];

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Welcome to **UniGuide AI**! 🎓\n\nI'm your admission counselor trained on the complete UniConnect database.\n\n**I can help you with:**\n- Finding the right university and program\n- Scholarship opportunities and eligibility\n- Merit calculation and aggregate formulas\n- Admission deadlines and requirements\n- Career guidance and study abroad info\n\nTo get started, could you share your academic background — your qualification, marks, and preferred field?",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [pastChats, setPastChats] = useState<SavedChat[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/chats")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPastChats(data);
      })
      .catch(() => {});
  }, []);

  const saveMessages = useCallback(
    async (msgs: Message[], existingChatId?: string | null) => {
      const chatMessages = msgs.slice(1).map((m) => ({ role: m.role, content: m.content }));
      try {
        if (existingChatId) {
          await fetch(`/api/chats/${existingChatId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatMessages }),
          });
        } else {
          const res = await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: chatMessages[0]?.content?.slice(0, 80) || "AI Chat",
              messages: chatMessages,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setChatId(data.id);
          }
        }
      } catch {
        // Silently fail - saving is a nice-to-have
      }
    },
    []
  );

  const loadChat = async (id: string) => {
    try {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) return;
      const chat = await res.json();
      const savedMessages: Message[] = JSON.parse(chat.messages || "[]");
      setMessages([WELCOME_MESSAGE, ...savedMessages]);
      setChatId(id);
      setShowHistory(false);
    } catch {
      // ignore
    }
  };

  const startNewChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setChatId(null);
    setShowHistory(false);
  };

  const handleSend = async (msg?: string) => {
    const userMsg = msg || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg } as Message];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const reply = await sendChatMessage(userMsg, history);
      const finalMessages = [...newMessages, { role: "assistant", content: reply } as Message];
      setMessages(finalMessages);
      await saveMessages(finalMessages, chatId);
    } catch {
      const errorMessages = [
        ...newMessages,
        { role: "assistant", content: "Sorry, I'm having trouble connecting to the AI service. Please try again later." } as Message,
      ];
      setMessages(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">UniGuide AI</h1>
        <p className="mt-2 text-muted-foreground">
          Ask anything about Pakistani university admissions, scholarships, and programs
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="mr-1 h-4 w-4" />
            History
          </Button>
          {chatId && (
            <Button variant="ghost" size="sm" onClick={startNewChat}>
              <Trash2 className="mr-1 h-4 w-4" />
              New Chat
            </Button>
          )}
        </div>
      </div>

      {showHistory && pastChats.length > 0 && (
        <div className="mb-4 rounded-lg border border-border bg-card p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Past Conversations</p>
          <div className="space-y-1">
            {pastChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span className="truncate max-w-[250px]">{chat.title}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(chat.updatedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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
          <span className="font-semibold">UniGuide AI</span>
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
