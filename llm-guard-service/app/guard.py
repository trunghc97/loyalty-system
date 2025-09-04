"""
Module for handling input/output validation and sanitization using llm-guard.
"""
from typing import List, Dict, Any
from llm_guard.input_scanners import (
    BanTopics,
    Code,
    Language,
    PromptInjection,
    Toxicity
)
from llm_guard.vault import Vault
from llm_guard.output_scanners import (
    NoRefusal,
    Relevance,
    Toxicity as OutputToxicity
)

class GuardValidator:
    def __init__(self):
        # Input scanners
        self.input_scanners = [
            Language(valid_languages=["en", "vi"], threshold=0.7),
            Toxicity(threshold=0.8),
            BanTopics(topics=["violence", "nsfw"]),
            PromptInjection(),
            Code(languages=["Python", "JavaScript", "Java", "Go"], threshold=0.8)
        ]

        # Output scanners
        self.output_scanners = [
            OutputToxicity(threshold=0.8),
            NoRefusal(),
            Relevance(threshold=0.7)
        ]

    def validate_input(self, messages: List[Dict[str, str]]) -> tuple[bool, str]:
        """
        Validate input messages using configured scanners.
        
        Args:
            messages: List of message dictionaries with role and content
            
        Returns:
            tuple[bool, str]: (is_valid, error_message)
        """
        # Get the latest user message
        latest_user_msg = next(
            (msg["content"] for msg in reversed(messages) if msg["role"] == "user"),
            None
        )
        
        if not latest_user_msg:
            return False, "No user message found"

        try:
            for scanner in self.input_scanners:
                try:
                    is_valid, sanitized_input = scanner.scan(latest_user_msg)
                except ValueError:
                    # Handle case where Language scanner returns only one value
                    is_valid = False
                    sanitized_input = latest_user_msg
                if not is_valid:
                    return False, f"Input rejected by {scanner.__class__.__name__}"
            return True, ""
        except Exception as e:
            return False, f"Error validating input: {str(e)}"

    def validate_output(self, prompt: str, response: str) -> tuple[bool, str]:
        """
        Validate model output using configured scanners.
        
        Args:
            prompt: Original input prompt
            response: Model generated response
            
        Returns:
            tuple[bool, str]: (is_valid, error_message)
        """
        try:
            for scanner in self.output_scanners:
                is_valid, sanitized_output = scanner.scan(prompt, response)
                if not is_valid:
                    return False, f"Output rejected by {scanner.__class__.__name__}"
            return True, ""
        except Exception as e:
            return False, f"Error validating output: {str(e)}"
