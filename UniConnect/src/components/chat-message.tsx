import { Bot, User, Loader2 } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

function formatMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class=\"bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-xs font-mono\">$1</code>");

  const lines = html.split("\n");
  const result: string[] = [];
  let inList: false | "ul" | "ol" = false;

  for (const line of lines) {
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      if (inList !== "ul") {
        if (inList) result.push("</ol>");
        result.push('<ul class="list-disc pl-4 space-y-1 my-1">');
        inList = "ul";
      }
      result.push(`<li>${line.trim().substring(2)}</li>`);
    } else if (line.match(/^\d+\.\s/)) {
      if (inList !== "ol") {
        if (inList) result.push("</ul>");
        result.push('<ol class="list-decimal pl-4 space-y-1 my-1">');
        inList = "ol";
      }
      result.push(`<li>${line.replace(/^\d+\.\s/, "")}</li>`);
    } else {
      if (inList) {
        result.push(inList === "ul" ? "</ul>" : "</ol>");
        inList = false;
        if (line.trim() === "") continue;
      }
      if (line.trim() === "") {
        result.push("<br/>");
      } else if (line.trim().startsWith("### ")) {
        result.push(`<h3 class="text-sm font-semibold mt-2 mb-1">${line.trim().substring(4)}</h3>`);
      } else if (line.trim().startsWith("## ")) {
        result.push(`<h2 class="text-base font-semibold mt-3 mb-1">${line.trim().substring(3)}</h2>`);
      } else {
        result.push(`<span>${line}</span><br/>`);
      }
    }
  }
  if (inList) {
    result.push(inList === "ul" ? "</ul>" : "</ol>");
  }

  return result.join("\n");
}

export function ChatMessage({ role, content, loading }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10">
          <Bot className="h-4 w-4 text-secondary" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-secondary text-white"
            : "bg-accent text-accent-foreground"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isUser ? (
          content
        ) : (
          <div
            className="prose prose-sm max-w-none dark:prose-invert [&_ul]:my-1 [&_ol]:my-1 [&_li]:text-sm [&_code]:text-xs [&_strong]:font-semibold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-xs [&_h3]:font-semibold"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
          />
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10">
          <User className="h-4 w-4 text-secondary" />
        </div>
      )}
    </div>
  );
}
