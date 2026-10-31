# Hệ thống quản lý thiết bị phòng học

- **Sinh viên:** Danh Gia Khánh
- **MSSV:** 235614
- **Học phần:** Điện toán đám mây

## 1. Mô tả đề tài

Ứng dụng web quản lý thiết bị phòng học gồm frontend, backend API và cơ sở dữ liệu MongoDB Atlas. Hệ thống cho phép xem danh sách, tìm kiếm, xem chi tiết, thêm, cập nhật, xóa thiết bị và theo dõi tình trạng sử dụng (Đang sử dụng, Hư hỏng, Đang sửa chữa, Ngừng sử dụng).

## 2. Công nghệ sử dụng

- Frontend: React (Vite)
- Backend: Node.js, Express, Mongoose
- Cơ sở dữ liệu: MongoDB Atlas
- Đóng gói: Docker, Docker Hub
- Triển khai: Render
- Quản lý mã nguồn: Git, GitHub

## 3. Cấu trúc dự án

```
235614_DanhGiaKhanh/
├── backend/     # API Node.js + Express
├── frontend/    # Giao diện React
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
| CORS_ORIGIN | Địa chỉ frontend được phép gọi API (`*` là cho phép tất cả) |

### Frontend (`frontend/.env`)

| Biến | Ý nghĩa |
|---|---|
| VITE_API_URL | Địa chỉ backend API (mặc định http://localhost:5000) |

Tệp `.env` chứa thông tin nhạy cảm nên không được đưa lên GitHub. Chỉ có `.env.example` được lưu trong repo.

## 6. API

| Phương thức | Đường dẫn | Chức năng |
|---|---|---|
| GET | /api/devices?search=... | Danh sách, tìm kiếm |
| GET | /api/devices/:id | Xem chi tiết |
| POST | /api/devices | Thêm thiết bị |
| PUT | /api/devices/:id | Cập nhật thiết bị |
| DELETE | /api/devices/:id | Xóa thiết bị |

## 7. Cấu hình địa chỉ API khi triển khai

Frontend lấy địa chỉ API theo thứ tự ưu tiên:

1. `frontend/public/config.js` (`window.APP_CONFIG.API_URL`)
2. Biến môi trường `VITE_API_URL`
3. Mặc định `http://localhost:5000`

## 8. Triển khai

(Sẽ cập nhật ở các câu sau)