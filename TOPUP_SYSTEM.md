# 💰 Hệ thống Nạp Xu - VNPay & Momo

## 📋 Tổng quan

Hệ thống nạp xu hoàn chỉnh cho phép học viên mua xu để đăng ký khóa học thông qua:
- ✅ VNPay (Chuyển khoản ngân hàng QR)
- ✅ Momo (Ví điện tử QR)

### Tính năng chính:
- 6 gói nạp xu linh hoạt
- Tỷ lệ quy đổi: **1.000đ = 20 xu**
- QR code tự động làm mới sau **15 phút**
- Kiểm tra thanh toán tự động mỗi **10 giây**
- Lịch sử giao dịch đầy đủ
- Giao diện đẹp, UX tối ưu

---

## 🎯 Các gói nạp xu

| Số tiền | Xu nhận được | Phổ biến |
|---------|--------------|----------|
| 50.000đ | 1.000 xu | |
| 100.000đ | 2.000 xu | |
| 200.000đ | 4.000 xu | ⭐ |
| 500.000đ | 10.000 xu | |
| 1.000.000đ | 20.000 xu | |
| 2.000.000đ | 40.000 xu | |

---

## 🗂️ Cấu trúc file

```
src/
├── pages/
│   └── TopUp.jsx                      # Trang chọn gói và phương thức thanh toán
├── components/
│   └── payment/
│       └── QRPayment.jsx              # Component hiển thị QR và xử lý thanh toán
└── config/
    └── api.js                         # API endpoints

backend/
└── routes/
    └── auth.js                        # API thanh toán (dòng 655+)
        ├── POST /create-topup-transaction
        ├── POST /check-payment-status
        ├── GET  /payment-history/:userId
        └── POST /admin/confirm-payment

public/
└── icons/
    ├── vnpay.png                      # Logo VNPay (optional)
    └── momo.png                       # Logo Momo (optional)
```

---

## 🔄 Luồng hoạt động

### 1. Học viên chọn gói nạp
```
TopUp.jsx → Hiển thị 6 gói → Chọn gói
```

### 2. Chọn phương thức thanh toán
```
TopUp.jsx → Chọn VNPay hoặc Momo → Generate QR
```

### 3. Hiển thị QR và chờ thanh toán
```
QRPayment.jsx:
- Tạo mã giao dịch: USER_ID-TIMESTAMP
- Generate QR URL từ VietQR (VNPay) hoặc Google Charts (Momo)
- Timer đếm ngược 15 phút
- Auto-check payment mỗi 10 giây
```

### 4. Xác nhận thanh toán
```
Backend API /check-payment-status:
- Kiểm tra transaction trong database
- Verify payment (hiện tại: demo mode - 30s)
- Cộng xu vào tài khoản user
- Cập nhật trạng thái transaction
- Trả về kết quả cho frontend
```

### 5. Hoàn tất
```
QRPayment.jsx:
- Hiển thị thông báo thành công
- Cập nhật số xu trong context
- Auto redirect sau 3 giây
```

---

## 🛠️ API Endpoints

### 1. Tạo giao dịch (Optional)
```http
POST /api/auth/create-topup-transaction

Body:
{
  "userId": "user_id",
  "transactionCode": "USER123-12345678",
  "paymentMethod": "vnpay",
  "amount": 100000,
  "coins": 2000
}

Response:
{
  "message": "Tạo giao dịch thành công",
  "transaction": {
    "id": "...",
    "transactionCode": "USER123-12345678",
    "amount": 100000,
    "coins": 2000,
    "status": "pending",
    "expiresAt": "2024-..."
  }
}
```

### 2. Kiểm tra thanh toán ⭐ (Main)
```http
POST /api/auth/check-payment-status

Body:
{
  "userId": "user_id",
  "transactionCode": "USER123-12345678",
  "paymentMethod": "vnpay",
  "amount": 100000,
  "coins": 2000
}

Response (Pending):
{
  "status": "pending",
  "message": "Đang chờ thanh toán",
  "timeRemaining": 847
}

Response (Success):
{
  "status": "success",
  "message": "Thanh toán thành công",
  "coinsAdded": 2000,
  "newBalance": 7000
}
```

### 3. Lịch sử giao dịch
```http
GET /api/auth/payment-history/:userId

Response:
{
  "transactions": [
    {
      "id": "...",
      "transactionCode": "USER123-12345678",
      "paymentMethod": "vnpay",
      "amount": 100000,
      "coins": 2000,
      "status": "success",
      "createdAt": "2024-...",
      "completedAt": "2024-..."
    }
  ]
}
```

### 4. Admin xác nhận thủ công
```http
POST /api/auth/admin/confirm-payment

Body:
{
  "transactionCode": "USER123-12345678",
  "adminUserId": "admin_id"
}

Response:
{
  "message": "Xác nhận thanh toán thành công",
  "transaction": {
    "transactionCode": "USER123-12345678",
    "userId": "...",
    "userName": "Nguyen Van A",
    "coinsAdded": 2000,
    "newBalance": 7000
  }
}
```

---

## 🎨 QR Code Generation

### VNPay (VietQR)
```javascript
const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(`NAP XU ${transactionCode}`)}&accountName=${encodeURIComponent(accountName)}`;
```

**Format:**
- Bank Code: VCB, TCB, MB, etc.
- Account No: Số tài khoản ngân hàng
- Amount: Số tiền
- AddInfo: Nội dung chuyển khoản
- AccountName: Tên chủ tài khoản

### Momo (Google Charts API)
```javascript
const qrContent = `2|99|${phoneNumber}|${accountName}|${amount}|NAP XU ${transactionCode}`;
const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(qrContent)}`;
```

**Format:**
- 2|99: Momo transaction type
- Phone: Số điện thoại Momo
- Name: Tên tài khoản
- Amount: Số tiền
- Message: Nội dung

---

## ⚙️ Cấu hình

### Frontend (QRPayment.jsx)

```javascript
// Thông tin thanh toán - THAY ĐỔI TẠI ĐÂY
const paymentConfig = {
  vnpay: {
    accountNo: '0123456789',           // ← Số tài khoản của bạn
    accountName: 'NGUYEN VAN A',       // ← Tên của bạn
    bankName: 'Vietcombank',           // ← Tên ngân hàng
    bankCode: 'VCB',                   // ← Mã ngân hàng
  },
  momo: {
    phoneNumber: '0987654321',         // ← SĐT Momo của bạn
    accountName: 'NGUYEN VAN A',       // ← Tên của bạn
  }
};
```

**Xem hướng dẫn chi tiết:** `PAYMENT_CONFIG.md`

### Backend Environment

Không cần cấu hình thêm environment variables cho chế độ DEMO.

Khi tích hợp thực tế, thêm vào `backend/.env`:
```env
VNPAY_API_KEY=your_vnpay_api_key
VNPAY_SECRET_KEY=your_vnpay_secret
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret
```

---

## 🧪 Testing

### 1. Chạy ứng dụng
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd backend
npm start
```

### 2. Flow test

1. Đăng nhập vào hệ thống
2. Click "Nạp xu" trên Navigation hoặc trong User dropdown
3. Chọn gói nạp (VD: 100.000đ = 2.000 xu)
4. Chọn phương thức (VNPay hoặc Momo)
5. Xem QR code hiển thị
6. **DEMO MODE:** Đợi 30 giây hoặc click "Kiểm tra thanh toán"
7. Thấy thông báo thành công
8. Kiểm tra số xu đã tăng

### 3. Kiểm tra Database

```javascript
// MongoDB - Collection: paymenttransactions
{
  "_id": "...",
  "userId": "...",
  "transactionCode": "USER123-12345678",
  "paymentMethod": "vnpay",
  "amount": 100000,
  "coins": 2000,
  "status": "success",
  "createdAt": "...",
  "completedAt": "...",
  "expiresAt": "..."
}
```

---

## 🔐 Bảo mật & Best Practices

### ✅ Đã implement:
- Transaction code unique
- Expiry time cho QR (15 phút)
- Status tracking (pending, success, failed, expired)
- Backend validation
- User authentication required

### ⚠️ Cần cải thiện (Production):
- Implement webhook từ VNPay/Momo
- Verify signature từ payment gateway
- Rate limiting cho API
- Log chi tiết giao dịch
- Email/SMS notification
- Refund mechanism
- Admin dashboard để quản lý transactions

---

## 🐛 Troubleshooting

### QR không hiển thị
- Kiểm tra URL format
- Kiểm tra network request
- Verify account info chính xác

### Không tự động cộng xu
- **DEMO MODE:** Đảm bảo đã đợi 30 giây
- Kiểm tra backend logs
- Verify transaction tồn tại trong DB
- Check user coins field

### Timer không hoạt động
- Clear browser cache
- Restart frontend dev server

---

## 📈 Mở rộng

### Thêm gói nạp mới

File: `src/pages/TopUp.jsx`

```javascript
const topUpPackages = [
  // ... existing packages
  { id: 7, amount: 5000000, coins: 100000, popular: false },
];
```

### Thêm payment method mới (VD: ZaloPay)

1. **Frontend:** Thêm config trong `QRPayment.jsx`
2. **Backend:** Thêm enum trong schema
3. **Generate QR:** Thêm logic tạo QR cho ZaloPay

---

## 📞 Support

Để được hỗ trợ tích hợp API thực tế:
- **VNPay:** https://vnpay.vn/
- **Momo:** https://business.momo.vn/

---

**✨ Hệ thống đã sẵn sàng sử dụng!**

Để chuyển sang môi trường production, vui lòng:
1. Đọc `PAYMENT_CONFIG.md` để cấu hình thông tin thanh toán
2. Tích hợp API VNPay/Momo thực tế
3. Setup webhook endpoints
4. Test kỹ lưỡng trước khi go-live

