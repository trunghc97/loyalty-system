"""
Module for interacting with Ollama API.
"""
import os
import requests
from typing import List, Dict, Any

class OllamaClient:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_API_URL", "http://ollama:11434")
        self.model = os.getenv("OLLAMA_MODEL", "phi3")
        
    def chat(self, messages: List[Dict[str, str]]) -> tuple[bool, str, Any]:
        """
        Send chat request to Ollama API.
        
        Args:
            messages: List of message dictionaries with role and content
            
        Returns:
            tuple[bool, str, Any]: (success, error_message, response_data)
        """
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False
                },
                timeout=30
            )
            
            if response.status_code != 200:
                return False, f"Ollama API error: {response.status_code}", None
                
            return True, "", response.json()
            
        except requests.exceptions.Timeout:
            return False, "Request to Ollama API timed out", None
        except requests.exceptions.RequestException as e:
            return False, f"Error calling Ollama API: {str(e)}", None
        except Exception as e:
            return False, f"Unexpected error: {str(e)}", None
