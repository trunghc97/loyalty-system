"""
FastAPI application for LLM chat with input/output validation.
"""
import logging
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .llm import OllamaClient
from .guard import GuardValidator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="LLM Guard Service")
ollama_client = OllamaClient()
guard = GuardValidator()

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]

class ChatResponse(BaseModel):
    response: str

@app.post("/api/llm/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that validates input/output and forwards requests to Ollama.
    """
    try:
        # Validate input
        is_valid, error_msg = guard.validate_input(request.messages)
        if not is_valid:
            logger.warning(f"Input validation failed: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)

        # Call Ollama
        success, error_msg, response_data = ollama_client.chat(request.messages)
        if not success:
            logger.error(f"Ollama API error: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

        # Get response content
        response_content = response_data.get("message", {}).get("content", "")
        if not response_content:
            raise HTTPException(status_code=500, detail="Empty response from Ollama")

        # Validate output
        latest_prompt = request.messages[-1]["content"]
        is_valid, error_msg = guard.validate_output(latest_prompt, response_content)
        if not is_valid:
            logger.warning(f"Output validation failed: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)

        return ChatResponse(response=response_content)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error in chat endpoint")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
