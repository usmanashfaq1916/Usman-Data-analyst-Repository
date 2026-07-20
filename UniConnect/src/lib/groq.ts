import Groq from "groq-sdk";

const MODEL = "llama-3.3-70b-versatile";

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    client = new Groq({ apiKey });
  }
  return client;
}

export async function getChatResponse(
  messages: { role: string; content: string }[],
  systemPrompt?: string,
  temperature = 0.7,
  maxTokens = 1024,
): Promise<string> {
  const groqMessages: { role: "system" | "user" | "assistant"; content: string }[] = [];
  if (systemPrompt) {
    groqMessages.push({ role: "system", content: systemPrompt });
  }
  for (const m of messages) {
    if (m.role === "system" || m.role === "user" || m.role === "assistant") {
      groqMessages.push({ role: m.role, content: m.content });
    } else {
      groqMessages.push({ role: "user", content: m.content });
    }
  }

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: groqMessages,
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content || "";
}
