import { buildSystemPrompt } from "@/lib/ai-system-prompt";
import { getChatResponse } from "@/lib/groq";

let systemPromptCache: string | null = null;
let cachePromise: Promise<string> | null = null;

async function getCachedSystemPrompt(): Promise<string> {
  if (systemPromptCache) return systemPromptCache;
  if (cachePromise) return cachePromise;
  cachePromise = buildSystemPrompt().then((prompt) => {
    systemPromptCache = prompt;
    cachePromise = null;
    return prompt;
  });
  return cachePromise;
}

function invalidateCache() {
  systemPromptCache = null;
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const msgs = (history ?? []).slice(-10);
    msgs.push({ role: "user", content: message });

    const systemPrompt = await getCachedSystemPrompt();
    const reply = await getChatResponse(msgs, systemPrompt, 0.7, 1536);
    return Response.json({ reply });
  } catch (e) {
    try {
      const { message } = await req.json().catch(() => ({ message: "" }));
      const fallback =
        `You are UniConnect AI, Pakistan's smartest university admissions assistant. ` +
        `Keep responses helpful, concise, and supportive. Never make up information.`;
      const reply = await getChatResponse(
        [{ role: "user", content: message || "Hello" }],
        fallback,
        0.7,
        1024,
      );
      return Response.json({ reply });
    } catch {
      return Response.json({ error: "AI service unavailable" }, { status: 500 });
    }
  }
}

export async function PATCH() {
  invalidateCache();
  return Response.json({ status: "ok", message: "Chat data cache refreshed" });
}
