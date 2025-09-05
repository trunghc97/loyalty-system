"""
Module for interacting with Ollama API.
"""
import os
import time
import json
import logging
import requests
from typing import List, Dict, Any
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_API_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama3.2")
        
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
        
    def chat(self, messages: List[Dict[str, str]], timeout: int = 180) -> tuple[bool, str, Any]:
        """
        Gửi yêu cầu chat đến Ollama API với xử lý timeout tối ưu.
        
        Args:
            messages: Danh sách tin nhắn với role và content
            timeout: Thời gian chờ tối đa cho mỗi request (giây)
            
        Returns:
            tuple[bool, str, Any]: (thành_công, thông_báo_lỗi, dữ_liệu_phản_hồi)
        """
        try:
            # Thêm system prompt tối ưu
            messages_with_lang = [
                {
                    "role": "system",
                    "content": (
                        "Bạn là một trợ lý AI, hãy **trả lời hoàn toàn bằng tiếng Việt** cho câu hỏi hoặc yêu cầu dưới đây.\n"
                        "\n"
                        "- Văn phong lịch sự, tự nhiên, thân thiện, ngắn gọn, dễ hiểu với người Việt Nam.\n"
                        "- Tránh dùng từ ngữ lạ, từ phiên âm hoặc các câu trả lời không tự nhiên.\n"
                        "- Nếu câu hỏi không rõ ràng hoặc không thuộc phạm vi hiểu biết, hãy trả lời: “Xin lỗi, tôi chưa rõ ý bạn. Bạn có thể đặt câu hỏi rõ hơn được không?”\n"
                        "- Không trả lời bằng tiếng Anh hoặc các ngôn ngữ khác.\n"
                        "- Nếu cần thiết, hãy giải thích ngắn gọn, không diễn giải dài dòng.\n"
                        "- Luôn đảm bảo câu trả lời rõ ràng, dễ đọc."
                        "Câu hỏi của người dùng:"
                    )
                },
                *messages
            ]
            
            # Tăng timeout cho câu hỏi dài
            msg_length = sum(len(m.get("content", "")) for m in messages)
            dynamic_timeout = min(timeout, max(90, msg_length // 50))  # 1s cho mỗi 50 ký tự

            # Chuẩn bị request data cân bằng tốc độ và chất lượng
            request_data = {
                "model": self.model,
                "messages": messages_with_lang,
                "stream": False,
                "options": {
                    "temperature": 0.4,  # cân bằng tốc độ và độ chính xác
                    "num_predict": 256,  # output vừa đủ
                    "top_k": 20,  # cân bằng
                    "top_p": 0.9,  # cân bằng
                    "num_thread": 8,  # tối ưu cho M1
                    "num_ctx": 2048,  # context hợp lý
                    "repeat_penalty": 1.1,  # tránh lặp
                    "repeat_last_n": 32   # tránh lặp trong context ngắn
                }
            }
            
            # Log request
            logger.info(f"Gửi request đến Ollama API: {json.dumps(request_data, ensure_ascii=False)}")
            
            # Thực hiện request với timeout động
            response = self.session.post(
                f"{self.base_url}/api/chat",
                json=request_data,
                timeout=dynamic_timeout
            )
            
            if response.status_code != 200:
                error_msg = f"Lỗi API (mã {response.status_code}): Vui lòng thử lại sau"
                logger.error(f"{error_msg}\nResponse: {response.text}")
                return False, error_msg, None
            
            # Log response
            response_data = response.json()
            logger.info(f"Nhận response từ Ollama API: {json.dumps(response_data, ensure_ascii=False)}")
            return True, "", response_data
            
        except requests.exceptions.Timeout:
            return False, "Quá thời gian chờ phản hồi. Vui lòng thử lại với câu hỏi ngắn hơn", None
        except requests.exceptions.RequestException as e:
            return False, f"Lỗi kết nối: {str(e)}", None
        except Exception as e:
            return False, f"Lỗi hệ thống: {str(e)}", None
