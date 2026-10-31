# Hệ thống quản lý thiết bị phòng học

- **Sinh viên:** Danh Gia Khánh
- **MSSV:** 235614
- **Học phần:** Điện toán đám mây

## 1. Mô tả đề tài

Ứng dụng web quản lý thiết bị phòng học gồm frontend, backend API và cơ sở dữ liệu MongoDB Atlas. Hệ thống cho phép xem danh sách, tìm kiếm, thêm, cập nhật, xóa thiết bị và theo dõi tình trạng sử dụng (Đang sử dụng, Hư hỏng, Đang sửa chữa, Ngừng sử dụng).

## 2. Công nghệ sử dụng

- Frontend: React (Vite)
- Backend: Node.js, Express, Mongoose
- Cơ sở dữ liệu: MongoDB Atlas
- Đóng gói: Docker, Docker Hub
- Triển khai: Render
- Quản lý mã nguồn: Git, GitHub

## 3. Cấu trúc dự án

    235614_DanhGiaKhanh/
    ├── backend/     # API Node.js + Express
    ├── frontend/    # Giao diện React
    ├── .gitignore
    └── README.md

## 4. Hướng dẫn cài đặt và chạy (local)

### Yêu cầu

Node.js 20 trở lên, Git, tài khoản MongoDB Atlas.

### Chạy backend

    cd backend
    npm install
    copy .env.example .env
    npm run dev

Sau khi sao chép `.env.example` thành `.env`, mở `.env` và điền `MONGODB_URI` của bạn. Backend chạy tại http://localhost:5000

### Chạy frontend

    cd frontend
    npm install
    npm run dev

Frontend chạy tại http://localhost:5173

## 5. Triển khai

(Sẽ cập nhật ở các câu sau)