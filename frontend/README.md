# Loyalty System Frontend

Ứng dụng frontend cho hệ thống Loyalty Points được xây dựng bằng React, TypeScript và Tailwind CSS.

## Tính năng

- Đăng nhập/Đăng ký tài khoản
- Quản lý điểm thưởng (tích điểm, chuyển điểm, đổi điểm)
- Quản lý voucher và quà tặng
- Lịch sử giao dịch
- Tích hợp blockchain cho giao dịch điểm
- Giao diện responsive, tối ưu cho mobile và iframe

## Yêu cầu hệ thống

- Node.js 20+
- npm 10+

## Cài đặt và chạy

1. Clone repository:
```bash
git clone https://github.com/your-username/loyalty-system.git
cd loyalty-system/frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env từ .env.example và cập nhật các biến môi trường:
```bash
cp .env.example .env
```

4. Chạy môi trường development:
```bash
npm run dev
```

5. Build cho production:
```bash
npm run build
```

6. Preview bản build:
```bash
npm run preview
```

## Cấu hình môi trường

File `.env` cần có các biến môi trường sau:

```env
VITE_API_JAVA=http://localhost:8080
VITE_API_GO=http://localhost:8081
```

## Docker

Build image:
```bash
docker build -t loyalty-frontend .
```

Chạy container:
```bash
docker run -p 80:80 loyalty-frontend
```

## Nhúng vào iframe

Để nhúng ứng dụng vào iframe, sử dụng code sau:

```html
<iframe 
  src="http://your-domain" 
  style="width: 100%; max-width: 480px; height: 100vh; border: none;"
  title="Loyalty System"
></iframe>
```

Lưu ý:
- Đặt max-width: 480px để tối ưu hiển thị trên mobile
- Ứng dụng đã được thiết kế để hoạt động tốt trong iframe
- Đảm bảo domain của ứng dụng được phép nhúng vào trang web của bạn (CORS policy)

## Cấu trúc thư mục

```
src/
  ├── components/     # Shared components
  │   ├── atoms/     # Basic UI components
  │   ├── molecules/ # Composite components
  │   └── organisms/ # Complex components
  ├── hooks/         # Custom hooks
  ├── pages/         # Page components
  ├── services/      # API services
  ├── types/         # TypeScript types
  ├── utils/         # Helper functions
  ├── App.tsx        # Root component
  └── main.tsx       # Entry point
```

## Coding Style

- Sử dụng ESLint và Prettier cho code formatting
- Tuân thủ TypeScript strict mode
- Sử dụng Tailwind CSS cho styling
- Atomic Design cho component structure

## Tối ưu hiệu năng

- Code splitting với React Router
- Lazy loading cho các components lớn
- Caching API calls với React Query
- Gzip compression trên Nginx
- Caching static assets

## Bảo mật

- HTTPS bắt buộc cho production
- Security headers được cấu hình trong Nginx
- Input validation với Zod
- XSS protection với React
- CORS policy được cấu hình

## Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

MIT License