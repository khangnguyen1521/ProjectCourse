# 🔐 Hướng dẫn Quản lý Thanh toán Admin

## 📍 Truy cập

**URL:** `/payment-management`

**Quyền truy cập:** Chỉ dành cho Admin

**Cách vào:**
1. Đăng nhập với tài khoản Admin
2. Click vào avatar → "Quản lý thanh toán"
3. Hoặc truy cập trực tiếp: `http://localhost:3000/payment-management`

---

## ✨ Tính năng

### 📊 **Dashboard Thống kê**

5 cards thống kê real-time:
- ⏳ **Chờ xử lý:** Số giao dịch đang chờ xác nhận
- ✅ **Thành công:** Số giao dịch đã hoàn tất
- ❌ **Thất bại:** Số giao dịch bị từ chối
- ⏰ **Hết hạn:** Số giao dịch quá 15 phút
- 💰 **Tổng doanh thu:** Tổng số tiền đã thu (chỉ tính success)

### 🔍 **Lọc & Tìm kiếm**

**Lọc theo trạng thái:**
- Tất cả
- Chờ xử lý (pending)
- Thành công (success)
- Thất bại (failed)
- Hết hạn (expired)

**Tìm kiếm theo:**
- Mã giao dịch
- Tên người dùng
- Email người dùng

### 📋 **Bảng danh sách**

Hiển thị thông tin chi tiết:
- ✅ Mã giao dịch (transaction code)
- 👤 Tên và email người dùng
- 💳 Phương thức thanh toán (VNPay/Momo)
- 💵 Số tiền
- 🪙 Số xu nhận được
- 📊 Trạng thái
- 🕐 Thời gian tạo và hoàn tất
- ⚡ Hành động (Xác nhận/Từ chối)

---

## 🎯 Cách sử dụng

### 1️⃣ **Xác nhận thanh toán (Manual Confirm)**

#### **Khi nào dùng:**
- User đã chuyển tiền nhưng hệ thống chưa tự động xác nhận
- Webhook/API failed
- User liên hệ support yêu cầu kiểm tra

#### **Các bước:**

```
1. Vào tab "Chờ xử lý"
2. Tìm giao dịch cần xác nhận
3. Kiểm tra thông tin:
   - Mã giao dịch
   - Tên người dùng
   - Số tiền
   - Số xu
4. Kiểm tra tài khoản ngân hàng/Momo:
   - Có tiền vào không?
   - Nội dung chuyển khoản đúng mã GD?
   - Số tiền đúng?
5. Click "Xác nhận"
6. Xem lại thông tin trong modal
7. Click "Xác nhận" lần nữa
8. ✅ Hoàn tất!
```

#### **Sau khi xác nhận:**
- ✅ Trạng thái chuyển sang "Thành công"
- 🪙 Xu được cộng vào tài khoản user
- 📧 User nhận thông báo (nếu có email notification)
- 📊 Dashboard stats tự động cập nhật

---

### 2️⃣ **Từ chối thanh toán**

#### **Khi nào dùng:**
- Không tìm thấy tiền chuyển vào
- Thông tin sai
- Gian lận
- User yêu cầu hủy

#### **Các bước:**

```
1. Vào tab "Chờ xử lý"
2. Tìm giao dịch cần từ chối
3. Click "Từ chối"
4. Xác nhận trong popup
5. ✅ Hoàn tất!
```

#### **Sau khi từ chối:**
- ❌ Trạng thái chuyển sang "Thất bại"
- 🚫 Xu KHÔNG được cộng
- 📊 Dashboard stats tự động cập nhật

---

### 3️⃣ **Làm mới danh sách**

Click nút **"Làm mới"** ở góc trên phải để cập nhật dữ liệu mới nhất.

**Auto-refresh:** Trang tự động làm mới mỗi **30 giây**.

---

## 📊 **Trạng thái giao dịch**

| Trạng thái | Ý nghĩa | Màu sắc | Có thể xác nhận? |
|------------|---------|---------|------------------|
| **Pending** | Chờ xử lý | 🟡 Vàng | ✅ Có |
| **Success** | Đã thành công | 🟢 Xanh lá | ❌ Không |
| **Failed** | Thất bại/Từ chối | 🔴 Đỏ | ❌ Không |
| **Expired** | Hết hạn (>15 phút) | ⚫ Xám | ❌ Không |

---

## 🔄 **Workflow hoàn chỉnh**

### **Trường hợp 1: Tự động (Webhook/API)**

```
User nạp xu
    ↓
Chuyển tiền thành công
    ↓
Webhook/API tự động xác nhận (30s trong demo)
    ↓
Status: Pending → Success
    ↓
Xu tự động cộng
    ↓
✅ HOÀN TẤT (không cần admin)
```

### **Trường hợp 2: Thủ công (Manual)**

```
User nạp xu
    ↓
Chuyển tiền thành công
    ↓
Webhook/API FAILED hoặc chưa xác nhận
    ↓
Status: Pending (còn màu vàng)
    ↓
User liên hệ support
    ↓
Admin vào Payment Management
    ↓
Kiểm tra tài khoản ngân hàng
    ↓
Thấy tiền → Click "Xác nhận"
    ↓
Status: Pending → Success
    ↓
Xu được cộng
    ↓
✅ HOÀN TẤT
```

---

## 🛡️ **Best Practices**

### ✅ **NÊN:**

1. ✅ **Luôn kiểm tra tài khoản trước khi xác nhận**
   - Vào app ngân hàng/Momo
   - Xác nhận tiền đã về
   - Đối chiếu số tiền và nội dung

2. ✅ **Đối chiếu thông tin**
   - Mã giao dịch khớp
   - Số tiền đúng
   - Nội dung chuyển khoản đúng format: `NAP XU [MÃ-GD]`

3. ✅ **Ghi chú/Screenshot**
   - Chụp màn hình giao dịch ngân hàng
   - Lưu lại để đối soát sau

4. ✅ **Xử lý nhanh**
   - Kiểm tra tab "Chờ xử lý" định kỳ (mỗi 1-2 giờ)
   - Ưu tiên giao dịch cũ nhất

5. ✅ **Thông báo user**
   - Sau khi xác nhận, nhắn user qua email/chat
   - "Đã cộng xu thành công"

### ❌ **KHÔNG NÊN:**

1. ❌ **Xác nhận khi chưa thấy tiền**
   - Có thể gian lận
   - Mất tiền

2. ❌ **Xác nhận nhiều lần cùng một GD**
   - Hệ thống có check nhưng vẫn cẩn thận
   - Có thể cộng xu trùng

3. ❌ **Từ chối không có lý do**
   - Luôn kiểm tra kỹ trước
   - Liên hệ user trước khi từ chối

---

## 🚨 **Xử lý sự cố**

### **Vấn đề 1: Không thấy giao dịch**

**Triệu chứng:** User báo đã chuyển tiền nhưng không thấy trong list.

**Cách fix:**
1. Click "Làm mới"
2. Kiểm tra tab "Tất cả"
3. Search theo tên user hoặc email
4. Nếu vẫn không có → Kiểm tra backend logs
5. Có thể transaction chưa được tạo

---

### **Vấn đề 2: Xác nhận lỗi**

**Triệu chứng:** Click "Xác nhận" nhưng báo lỗi.

**Cách fix:**
1. Kiểm tra console/network tab
2. Có thể lỗi network
3. Refresh page và thử lại
4. Kiểm tra backend logs
5. Kiểm tra connection MongoDB

---

### **Vấn đề 3: Xu không được cộng**

**Triệu chứng:** Xác nhận thành công nhưng xu không tăng.

**Cách fix:**
1. Kiểm tra database MongoDB:
   ```javascript
   db.users.findOne({ _id: "USER_ID" })
   // Xem field coins
   ```
2. Kiểm tra backend logs
3. Có thể lỗi khi save user
4. Thử xác nhận lại (nếu status vẫn pending)

---

## 📱 **API Endpoints**

Admin có thể dùng trực tiếp:

### 1. Lấy tất cả transactions
```http
GET /api/auth/admin/all-transactions
```

### 2. Xác nhận thanh toán
```http
POST /api/auth/admin/confirm-payment

Body:
{
  "transactionCode": "USER123-12345678",
  "adminUserId": "admin_id"
}
```

### 3. Từ chối thanh toán
```http
POST /api/auth/admin/reject-payment

Body:
{
  "transactionCode": "USER123-12345678",
  "adminUserId": "admin_id"
}
```

---

## 📊 **Reports & Analytics**

### **Thống kê hàng ngày:**

```sql
- Tổng giao dịch hôm nay
- Tổng doanh thu hôm nay
- Số GD pending
- Số GD cần xử lý thủ công
- Tỷ lệ success/failed
```

### **Export dữ liệu** (Coming soon):

- Export CSV
- Export Excel
- Filter by date range
- Filter by payment method

---

## ⚡ **Keyboard Shortcuts** (Coming soon)

- `Ctrl/Cmd + R`: Refresh
- `Ctrl/Cmd + F`: Focus search
- `Ctrl/Cmd + 1-5`: Switch status tabs
- `Escape`: Close modal

---

## 🎓 **Training Checklist**

Đào tạo admin mới:

- [ ] Hiểu quy trình nạp xu
- [ ] Biết cách kiểm tra tài khoản ngân hàng/Momo
- [ ] Thực hành xác nhận 1 giao dịch test
- [ ] Thực hành từ chối 1 giao dịch test
- [ ] Biết cách xử lý sự cố cơ bản
- [ ] Hiểu các trạng thái transaction
- [ ] Biết khi nào cần escalate lên technical team

---

## 📞 **Support**

**Technical issues:**
- Check backend logs: `cd backend && npm start`
- Check MongoDB connection
- Check API endpoints

**Questions:**
- Contact: support@yourwebsite.com
- Slack: #admin-payment-support

---

## 🔒 **Security Notes**

1. **Chỉ admin** mới có quyền truy cập
2. **Mọi hành động** đều được log
3. **Không share** tài khoản admin
4. **Đổi password** định kỳ
5. **2FA** (khuyến nghị enable)

---

**✨ Trang Payment Management đã sẵn sàng sử dụng!**

Mọi thắc mắc vui lòng liên hệ technical team.

