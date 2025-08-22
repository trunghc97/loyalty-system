# Loyalty System

Hệ thống quản lý điểm thưởng (loyalty points) với các tính năng:
- Đăng ký/đăng nhập tài khoản
- Earn/transfer/redeem points
- Quản lý voucher và quà tặng
- Tích hợp blockchain cho các giao dịch

## Kiến trúc

Hệ thống gồm 3 microservice chính:

1. **backend-java** (Spring Boot, port 8080)
   - Quản lý user, points, voucher/gifts
   - REST APIs cho toàn bộ nghiệp vụ
   - MongoDB để lưu trữ dữ liệu

2. **backend-go** (Echo/Fiber, port 8081) 
   - Xử lý blockchain anchor, trade, pay
   - Mock blockchain transactions
   - REST APIs cho blockchain operations

3. **frontend** (React + Tailwind, port 3000)
   - UI responsive 
   - Tích hợp với cả 2 backend services
   - Hiển thị trạng thái giao dịch realtime

## Cài đặt

### Yêu cầu
- Docker và Docker Compose
- Java 17+ (để develop)
- Go 1.19+ (để develop)
- Node.js 16+ (để develop)

### Chạy hệ thống
1. Copy file môi trường:
```bash
cp .env.example .env
```

2. Build và chạy với Docker Compose:
```bash
docker-compose up -d
```

3. Truy cập các services:
- Frontend: http://localhost:3000
- Backend Java API: http://localhost:8080
- Backend Go API: http://localhost:8081
- MongoDB Express: http://localhost:8082

## API Documentation

### Backend Java (8080)

#### Authentication
- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập

#### Account
- `GET /account/balance` - Xem số dư điểm

#### Points
- `POST /points/earn` - Earn points
- `POST /points/transfer` - Chuyển points
- `POST /points/redeem` - Đổi points

#### Gifts & Vouchers  
- `GET /gifts` - Danh sách quà tặng
- `GET /vouchers` - Danh sách voucher
- `GET /transactions` - Lịch sử giao dịch
- `POST /redeem/voucher` - Đổi voucher
- `POST /redeem/credit-payment` - Thanh toán thẻ tín dụng

### Backend Go (8081)

#### Blockchain
- `POST /blockchain/anchor-receipt` - Anchor receipt lên blockchain
- `POST /blockchain/trade` - Thực hiện trade
- `POST /blockchain/pay` - Thực hiện payment
- `GET /blockchain/status` - Kiểm tra trạng thái transaction

## Development

### Backend Java
```bash
cd backend-java
./mvnw spring-boot:run
```

### Backend Go
```bash
cd backend-go
go run cmd/main.go
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Test Account
- Username: `demo`
- Password: `demo123`

## License
MIT
