import os
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

client = AsyncGroq(api_key=GROQ_API_KEY)


async def get_chat_response(
    messages: list[dict],
    system_prompt: str | None = None,
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> str:
    groq_messages = []
    if system_prompt:
        groq_messages.append({"role": "system", "content": system_prompt})
    groq_messages.extend(messages)

    response = await client.chat.completions.create(
        model=MODEL,
        messages=groq_messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content or ""
