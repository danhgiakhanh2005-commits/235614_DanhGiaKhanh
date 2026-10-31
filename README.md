# Hệ thống quản lý thiết bị phòng học

- **Sinh viên:** Danh Gia Khánh
- **MSSV:** 235614
- **Học phần:** Điện toán đám mây

## 1. Mô tả đề tài

Ứng dụng web quản lý thiết bị phòng học gồm frontend, backend API và cơ sở dữ liệu MongoDB Atlas. Hệ thống cho phép xem danh sách, tìm kiếm, xem chi tiết, thêm, cập nhật, xóa thiết bị và theo dõi tình trạng sử dụng (Đang sử dụng, Hư hỏng, Đang sửa chữa, Ngừng sử dụng).

## 2. Công nghệ sử dụng

- Frontend: React (Vite), nginx khi đóng gói Docker
- Backend: Node.js, Express, Mongoose
- Cơ sở dữ liệu: MongoDB Atlas
- Đóng gói: Docker, Docker Hub
- Triển khai: Render
- Quản lý mã nguồn: Git, GitHub

## 3. Cấu trúc dự án

```
235614_DanhGiaKhanh/
├── backend/     # API Node.js + Express (có Dockerfile)
├── frontend/    # Giao diện React (có Dockerfile)
├── .gitignore
└── README.md
```

## 4. Hướng dẫn cài đặt và chạy (local)

### Yêu cầu

Node.js 20.19 trở lên (hoặc 22.12 trở lên), Git, tài khoản MongoDB Atlas.

### Chạy backend

```
cd backend
npm install
copy .env.example .env
npm run dev
```

Sau khi sao chép `.env.example` thành `.env`, mở `.env` và điền `MONGODB_URI` của bạn. Backend chạy tại http://localhost:5000

### Chạy frontend

Mở một terminal khác:

```
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend chạy tại http://localhost:5173

## 5. Biến môi trường

### Backend (`backend/.env`)

| Biến | Ý nghĩa |
|---|---|
| PORT | Cổng chạy backend (mặc định 5000) |
| MONGODB_URI | Chuỗi kết nối MongoDB Atlas |
| CORS_ORIGIN | Địa chỉ frontend được phép gọi API, nhiều địa chỉ cách nhau bằng dấu phẩy (`*` là cho phép tất cả) |

### Frontend (`frontend/.env`)

| Biến | Ý nghĩa |
|---|---|
| VITE_API_URL | Địa chỉ backend API (mặc định http://localhost:5000) |

Tệp `.env` chứa thông tin nhạy cảm nên không được đưa lên GitHub. Chỉ có `.env.example` được lưu trong repo.

## 6. API

| Phương thức | Đường dẫn | Chức năng |
|---|---|---|
| GET | /health | Kiểm tra trạng thái backend và kết nối MongoDB |
| GET | /api/devices | Lấy danh sách thiết bị |
| GET | /api/devices?search=... | Tìm kiếm thiết bị theo từ khóa |
| GET | /api/devices/:id | Xem thông tin một thiết bị |
| POST | /api/devices | Thêm thiết bị mới |
| PUT | /api/devices/:id | Cập nhật thông tin thiết bị |
| DELETE | /api/devices/:id | Xóa thiết bị |

## 7. Cấu hình địa chỉ API khi triển khai

Frontend lấy địa chỉ API theo thứ tự ưu tiên:

1. `frontend/public/config.js` (`window.APP_CONFIG.API_URL`)
2. Biến môi trường `VITE_API_URL`
3. Mặc định `http://localhost:5000`

Khi chạy bằng Docker, tệp `config.js` được tạo lại mỗi lần container khởi động từ biến môi trường `API_URL`.

## 8. Chạy backend bằng Docker

Image trên Docker Hub: https://hub.docker.com/r/danhgiakhanh/backend

Image không chứa thông tin bí mật. Các biến môi trường được truyền vào khi chạy container.

### Chạy từ image trên Docker Hub

Cách 1: truyền biến trực tiếp (PowerShell, một dòng):

```
docker run -d --name backend -p 5000:5000 -e PORT=5000 -e MONGODB_URI="<chuoi-ket-noi-mongodb-atlas>" -e CORS_ORIGIN="*" danhgiakhanh/backend
```

Cách 2: dùng tệp `.env` (giá trị không đặt trong dấu nháy):

```
docker run -d --name backend -p 5000:5000 --env-file .env danhgiakhanh/backend
```

Kiểm tra: mở http://localhost:5000/health, kết quả có dạng `{"status":"ok","database":"connected","time":"..."}`.

Dừng và xóa container:

```
docker stop backend
docker rm backend
```

### Tự build image từ mã nguồn

```
cd backend
docker build -t danhgiakhanh/backend .
```

### Đẩy image lên Docker Hub

```
docker login
docker push danhgiakhanh/backend
```

## 9. Chạy frontend bằng Docker

Image trên Docker Hub: https://hub.docker.com/r/danhgiakhanh/frontend

Image dùng nginx phục vụ bản build React. Địa chỉ backend được truyền qua biến môi trường `API_URL` khi chạy container, không cần build lại image khi đổi backend.

### Chạy từ image trên Docker Hub

```
docker run -d --name frontend -p 8080:80 -e API_URL=http://localhost:5000 danhgiakhanh/frontend
```

Mở http://localhost:8080 (backend phải đang chạy tại địa chỉ `API_URL`).

| Biến | Ý nghĩa |
|---|---|
| API_URL | Địa chỉ backend API mà trình duyệt sẽ gọi |
| PORT | Cổng nginx lắng nghe trong container (mặc định 80) |

Dừng và xóa container:

```
docker stop frontend
docker rm frontend
```

### Tự build image từ mã nguồn

```
cd frontend
docker build -t danhgiakhanh/frontend .
```

### Đẩy image lên Docker Hub

```
docker login
docker push danhgiakhanh/frontend
```

## 10. Triển khai

(Sẽ cập nhật ở các câu sau)