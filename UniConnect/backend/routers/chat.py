import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_client import get_chat_response
from services.uniconnect_data import build_system_prompt, get_fallback_prompt

router = APIRouter()

_system_prompt_cache: str | None = None
_cache_lock = asyncio.Lock()


async def get_cached_system_prompt() -> str:
    global _system_prompt_cache
    async with _cache_lock:
        if _system_prompt_cache is None:
            _system_prompt_cache = await build_system_prompt()
        return _system_prompt_cache


def invalidate_cache():
    global _system_prompt_cache
    _system_prompt_cache = None


class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        history = request.history or []
        messages = history[-10:] + [{"role": "user", "content": request.message}]

        system_prompt = await get_cached_system_prompt()

        reply = await get_chat_response(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=1536,
        )
        return ChatResponse(reply=reply)
    except Exception as e:
        try:
            fallback = get_fallback_prompt()
            reply = await get_chat_response(
                messages=messages if 'messages' in dir() else [{"role": "user", "content": request.message}],
                system_prompt=fallback,
                temperature=0.7,
                max_tokens=1024,
            )
            return ChatResponse(reply=reply)
        except Exception as e2:
            raise HTTPException(status_code=500, detail=str(e2))


@router.post("/chat/refresh")
async def refresh_chat_data():
    invalidate_cache()
    await get_cached_system_prompt()
    return {"status": "ok", "message": "Chat data cache refreshed"}
