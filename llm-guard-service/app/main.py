"""
FastAPI application for LLM chat with input/output validation.
"""
import logging
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from llm import OllamaClient
from guard import GuardValidator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def log_request_details(messages: List[Dict[str, str]], error: str = None):
    """Log request details and optional error."""
    try:
        last_message = messages[-1] if messages else {}
        log_data = {
            "last_message_role": last_message.get("role", "unknown"),
            "last_message_length": len(last_message.get("content", "")),
            "total_messages": len(messages),
            "error": error
        }
        if error:
            logger.error(f"Request failed: {log_data}")
        else:
            logger.info(f"Processing request: {log_data}")
    except Exception as e:
        logger.error(f"Error logging request details: {str(e)}")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LLM Guard Service")
ollama_client = OllamaClient()
guard = GuardValidator()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]

class ChatResponse(BaseModel):
    answer: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that validates input/output and forwards requests to Ollama.
    """
    try:
        # Log incoming request
        log_request_details(request.messages)
        
        # Validate input
        is_valid, error_msg = guard.validate_input(request.messages)
        if not is_valid:
            log_request_details(request.messages, error=f"Input validation: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)

        # Call Ollama
        success, error_msg, response_data = ollama_client.chat(request.messages)
        if not success:
            log_request_details(request.messages, error=f"Ollama API: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

        # Get response content
        response_content = response_data.get("message", {}).get("content", "")
        if not response_content:
            log_request_details(request.messages, error="Empty response from Ollama")
            raise HTTPException(status_code=500, detail="Empty response from Ollama")

        # Validate output
        latest_prompt = request.messages[-1]["content"]
        is_valid, error_msg = guard.validate_output(latest_prompt, response_content)
        if not is_valid:
            log_request_details(request.messages, error=f"Output validation: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)

        return ChatResponse(answer=response_content)

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Unexpected error in chat endpoint: {str(e)}"
        logger.exception(error_msg)
        log_request_details(request.messages, error=error_msg)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
