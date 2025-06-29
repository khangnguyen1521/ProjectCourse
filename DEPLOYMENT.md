# 🚀 Hướng dẫn Deploy ProjectCourse

## 📋 Chuẩn bị trước khi deploy

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Tạo MongoDB Atlas (Database Cloud miễn phí)
1. Đăng ký tại [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Tạo cluster mới (chọn Free tier)
3. Tạo database user và lấy connection string
4. Whitelist IP: `0.0.0.0/0` (cho phép tất cả IP)

---

## 🌟 **PHƯƠNG ÁN 1: RENDER.COM (KHUYẾN NGHỊ)**

### ✅ Ưu điểm:
- **Hoàn toàn miễn phí**
- Tự động deploy khi push code
- Hỗ trợ full-stack app
- SSL certificate tự động

### 🛠️ Các bước deploy:

#### **Bước 1: Deploy Backend**
1. Đăng ký tại [Render.com](https://render.com)
2. Connect với GitHub repository
3. Tạo **Web Service** mới:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Thêm Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/projectcourse
   NODE_ENV=production
   PORT=5000
   ```

#### **Bước 2: Deploy Frontend**
1. Tạo **Static Site** mới trong Render
2. **Build Command**: `npm install && npm run build`
3. **Publish Directory**: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

#### **Bước 3: Cập nhật CORS**
Sau khi có URL frontend, cập nhật `backend/server.js`:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.onrender.com']
    : 'http://localhost:3000',
  credentials: true
};
```

---

## 🚀 **PHƯƠNG ÁN 2: VERCEL + RAILWAY**

### **Deploy Backend trên Railway:**
1. Đăng ký [Railway.app](https://railway.app)
2. Import từ GitHub
3. **Variables**:
   ```
   MONGO_URI=your_mongodb_atlas_url
   NODE_ENV=production
   ```

### **Deploy Frontend trên Vercel:**
1. Đăng ký [Vercel.com](https://vercel.com)
2. Import từ GitHub
3. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
   ```

---

## 🔧 **PHƯƠNG ÁN 3: NETLIFY + HEROKU**

### **Deploy Backend trên Heroku:**
```bash
# Cài Heroku CLI
npm install -g heroku

# Login và tạo app
heroku login
heroku create your-app-backend

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_atlas_url
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix backend heroku main
```

### **Deploy Frontend trên Netlify:**
1. Đăng ký [Netlify.com](https://netlify.com)
2. Drag & drop thư mục `build` (sau khi chạy `npm run build`)
3. Hoặc connect với GitHub để auto-deploy

---

## 🔄 **Cập nhật code cho production**

### 1. Cập nhật API calls trong frontend
Tạo file `src/config/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export default API_BASE_URL;
```

### 2. Thay thế hardcoded URLs
Trong các file component, thay:
```javascript
// Cũ
axios.get('http://localhost:5000/api/...')

// Mới
import API_BASE_URL from '../config/api';
axios.get(`${API_BASE_URL}/api/...`)
```

---

## 📱 **Kiểm tra sau khi deploy**

### ✅ Checklist:
- [ ] Backend API hoạt động: `https://your-backend-url/health`
- [ ] Database kết nối thành công
- [ ] Frontend load được
- [ ] Đăng ký/đăng nhập hoạt động
- [ ] CORS được cấu hình đúng
- [ ] Environment variables được set

### 🐛 Debug thường gặp:
1. **CORS Error**: Kiểm tra CORS origin trong backend
2. **500 Error**: Kiểm tra MongoDB connection string
3. **API not found**: Kiểm tra REACT_APP_API_URL
4. **Build failed**: Kiểm tra dependencies trong package.json

---

## 💡 **Tips để deploy thành công:**

### 🔒 **Bảo mật:**
- Không commit file `.env` 
- Sử dụng environment variables cho mọi secrets
- Whitelist IP cho MongoDB Atlas

### ⚡ **Performance:**
- Enable gzip compression
- Sử dụng CDN cho static assets
- Cache API responses

### 📊 **Monitoring:**
- Set up health check endpoints
- Monitor database connections
- Log errors properly

---

## 🆘 **Hỗ trợ thêm:**

Nếu gặp vấn đề trong quá trình deploy, cung cấp thông tin:
1. Platform deploy nào
2. Error message cụ thể
3. Screenshot console/logs
4. URL repo nếu có thể

**Chúc bạn deploy thành công! 🎉** 