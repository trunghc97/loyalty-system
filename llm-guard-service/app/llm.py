"""
Module for interacting with Ollama API.
"""
import os
import time
import requests
from typing import List, Dict, Any
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

class OllamaClient:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_API_URL", "http://ollama:11434")
        self.model = os.getenv("OLLAMA_MODEL", "phi3")
        
        # Configure retry strategy
        retry_strategy = Retry(
            total=5,  # number of retries
            backoff_factor=1,  # wait 1, 2, 4, 8, 16 seconds between retries
            status_forcelist=[500, 502, 503, 504],  # retry on these HTTP status codes
            allowed_methods=["POST"]  # allow retries for POST requests
        )
        
        # Create session with retry strategy
        self.session = requests.Session()
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
    def chat(self, messages: List[Dict[str, str]]) -> tuple[bool, str, Any]:
        """
        Send chat request to Ollama API.
        
        Args:
            messages: List of message dictionaries with role and content
            
        Returns:
            tuple[bool, str, Any]: (success, error_message, response_data)
        """
        try:
            response = self.session.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False
                },
                timeout=60
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
