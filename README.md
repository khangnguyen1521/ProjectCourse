# VietLearn - Nền tảng học tập trực tuyến

Một nền tảng học tập trực tuyến hiện đại và chuyên nghiệp được xây dựng với React, Node.js và MongoDB.

## 🚀 Tính năng chính

### Cho học viên:
- **Dashboard thông minh**: Theo dõi tiến độ học tập, điểm số và thành tích
- **Khóa học đa dạng**: 9 môn học từ Khoa học tự nhiên đến Khoa học xã hội
- **Bài kiểm tra tương tác**: Hệ thống thi trực tuyến với timer và kết quả tức thì
- **Theo dõi tiến độ**: Hiển thị chi tiết tiến độ học tập từng khóa học
- **Hồ sơ cá nhân**: Cập nhật thông tin cá nhân và xem lịch sử học tập

### Cho admin:
- **Quản lý người dùng**: Xem danh sách và xóa người dùng
- **Truy cập toàn bộ**: Có thể xem tất cả khóa học mà không cần đăng ký

## 🛠️ Công nghệ sử dụng

### Frontend:
- **React 18** - Framework UI
- **React Router** - Điều hướng
- **Tailwind CSS** - Styling
- **Framer Motion** - Animation
- **Context API** - State management

### Backend:
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống:
- Node.js (v14 trở lên)
- MongoDB
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd ProjectCourse
```

### Bước 2: Cài đặt dependencies
```bash
# Cài đặt dependencies cho frontend
npm install

# Cài đặt dependencies cho backend
cd backend
npm install
cd ..
```

### Bước 3: Cấu hình MongoDB
1. Tạo file `.env` trong thư mục `backend`:
```env
MONGO_URI=mongodb://localhost:27017/projectcourse
PORT=5000
```

2. Khởi động MongoDB:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### Bước 4: Khởi động ứng dụng

#### Cách 1: Chạy cả frontend và backend cùng lúc
```bash
npm run dev
```

#### Cách 2: Chạy riêng lẻ
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Bước 5: Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Cấu trúc dự án

```
ProjectCourse/
├── backend/                 # Backend Node.js
│   ├── routes/
│   │   └── auth.js         # API routes
│   │   └── package.json
│   ├── server.js           # Server entry point
│   └── package.json
├── public/                  # Static files
│   ├── img/                # Images
│   └── index.html
├── src/                     # React source code
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── course/         # Course components
│   │   ├── exam/           # Exam components
│   │   ├── layout/         # Layout components
│   │   └── modal/          # Modal components
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx   # Dashboard page
│   │   ├── Courses.jsx     # Courses page
│   │   ├── Exams.jsx       # Exams page
│   │   └── Profile.jsx     # Profile page
│   └── App.jsx             # Main App component
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `PUT /api/auth/update-profile` - Cập nhật thông tin cá nhân

### Course Management
- `POST /api/auth/enroll-course` - Đăng ký khóa học
- `POST /api/auth/update-progress` - Cập nhật tiến độ học tập

### Dashboard & Statistics
- `GET /api/auth/dashboard-stats/:userId` - Lấy thống kê dashboard
- `GET /api/auth/user-courses/:userId` - Lấy danh sách khóa học của user
- `GET /api/auth/user-exams/:userId` - Lấy danh sách bài kiểm tra của user

### Exam Management
- `POST /api/auth/submit-exam` - Nộp bài kiểm tra

### Admin
- `GET /api/auth/allusers` - Lấy danh sách tất cả user
- `DELETE /api/auth/delete-user/:userId` - Xóa user

## 👥 Tài khoản mẫu

### Học viên:
- Email: student@example.com
- Password: 123456

### Admin:
- Email: admin@example.com
- Password: 123456

## 🎯 Hướng dẫn sử dụng

### 1. Đăng ký/Đăng nhập
- Truy cập trang chủ và click "Đăng nhập"
- Đăng ký tài khoản mới hoặc đăng nhập với tài khoản có sẵn

### 2. Khám phá khóa học
- Vào trang "Khóa học" để xem danh sách khóa học
- Sử dụng bộ lọc và tìm kiếm để tìm khóa học phù hợp
- Click "Đăng ký ngay" để đăng ký khóa học

### 3. Học tập
- Sau khi đăng ký, vào trang khóa học để bắt đầu học
- Theo dõi tiến độ học tập trong Dashboard

### 4. Làm bài kiểm tra
- Vào trang "Bài kiểm tra" để làm bài thi
- Chọn môn học và bắt đầu làm bài
- Xem kết quả ngay sau khi hoàn thành

### 5. Quản lý hồ sơ
- Vào trang "Hồ sơ" để cập nhật thông tin cá nhân
- Xem lịch sử học tập và thành tích

## 🔧 Tùy chỉnh

### Thêm khóa học mới:
1. Cập nhật mảng `courses` trong `src/pages/Courses.jsx`
2. Thêm hình ảnh vào thư mục `public/img/`
3. Tạo component khóa học tương ứng

### Thay đổi giao diện:
- Sử dụng Tailwind CSS classes trong các component
- Cập nhật theme colors trong `tailwind.config.js`

### Cấu hình database:
- Thay đổi connection string trong `backend/.env`
- Cập nhật schema trong `backend/routes/auth.js`

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB:
```bash
# Kiểm tra MongoDB service
sudo systemctl status mongod

# Khởi động lại MongoDB
sudo systemctl restart mongod
```

### Lỗi port đã được sử dụng:
```bash
# Tìm process sử dụng port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Lỗi dependencies:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ

- Email: thanhthanthiendia12@gmail.com
- GitHub: https://github.com/khangnguyen1521

---

**Lưu ý**: Đây là phiên bản demo. Vui lòng không sử dụng trong môi trường production mà không có các biện pháp bảo mật bổ sung. 