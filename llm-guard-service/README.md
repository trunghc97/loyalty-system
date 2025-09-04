# LLM Guard Service

Service trung gian để kiểm duyệt và xử lý các yêu cầu chat LLM, sử dụng Ollama làm backend và llm-guard để bảo vệ.

## Tính năng

- API endpoint `/api/llm/chat` để tương tác với model phi3
- Kiểm duyệt input/output sử dụng llm-guard
- Chặn nội dung độc hại, prompt injection và các từ khóa nhạy cảm
- Chạy hoàn toàn trong Docker, không cần cài đặt thêm

## Cài đặt

Yêu cầu:
- Docker và Docker Compose

Không cần cài đặt Python hay Ollama trên máy host.

## Khởi chạy

1. Build và chạy các service:
```bash
docker-compose up -d
```

2. Kiểm tra logs:
```bash
docker-compose logs -f llm-service
```

3. Đợi cho đến khi Ollama pull xong model phi3 (có thể mất vài phút).

## Sử dụng API

### Chat Endpoint

**POST** `/api/llm/chat`

Request body:
```json
{
  "messages": [
    {"role": "user", "content": "Xin chào!"}
  ]
}
```

Curl example:
```bash
curl -X POST http://localhost:8082/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Xin chào!"}]}'
```

Response:
```json
{
  "response": "Xin chào! Tôi có thể giúp gì cho bạn?"
}
```

## Tối ưu hóa

Để giảm tải RAM/CPU:

1. Sử dụng model nhẹ hơn:
   - Thay đổi `OLLAMA_MODEL=phi3` thành `OLLAMA_MODEL=phi2` trong docker-compose.yml
   - Model phi2 nhẹ hơn nhưng vẫn cho kết quả tốt

2. Cấu hình Ollama:
   - Thêm biến môi trường `OLLAMA_HOST_CUDA_VISIBLE_DEVICES=""` để tắt GPU
   - Giới hạn RAM: thêm `mem_limit: "4g"` trong docker-compose.yml

3. Điều chỉnh worker Uvicorn:
   - Thêm `--workers 1` vào CMD trong Dockerfile nếu tải thấp
   - Mặc định là 1 worker

## Bảo mật

Service sử dụng llm-guard để:
- Chặn prompt injection
- Lọc nội dung độc hại
- Kiểm tra ngôn ngữ
- Ẩn thông tin nhạy cảm
- Đảm bảo phản hồi phù hợp

Có thể thêm policy mới trong `guard.py`.
