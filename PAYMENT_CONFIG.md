# Hướng dẫn cấu hình thanh toán VNPay & Momo

## 📍 Vị trí file cấu hình

File cần chỉnh sửa: `src/components/payment/QRPayment.jsx`

## 🔧 Cách thay đổi thông tin thanh toán

### 1. Tìm đoạn code cấu hình (dòng ~19-30):

```javascript
// Payment configuration - User có thể thay đổi sau
const paymentConfig = {
  vnpay: {
    accountNo: '0123456789',
    accountName: 'NGUYEN VAN A',
    bankName: 'Vietcombank',
    bankCode: 'VCB',
  },
  momo: {
    phoneNumber: '0987654321',
    accountName: 'NGUYEN VAN A',
  }
};
```

### 2. Thay đổi thông tin VNPay:

```javascript
vnpay: {
  accountNo: 'SỐ_TÀI_KHOẢN_CỦA_BẠN',        // Số tài khoản ngân hàng
  accountName: 'TÊN_CHỦ_TÀI_KHOẢN',         // Tên chủ tài khoản (viết HOA, không dấu)
  bankName: 'TÊN_NGÂN_HÀNG',                // Tên ngân hàng đầy đủ
  bankCode: 'MÃ_NGÂN_HÀNG',                 // Mã ngân hàng (VD: VCB, TCB, MB, VPB...)
}
```

**Ví dụ:**
```javascript
vnpay: {
  accountNo: '1234567890',
  accountName: 'TRAN THI B',
  bankName: 'Techcombank',
  bankCode: 'TCB',
}
```

### 3. Thay đổi thông tin Momo:

```javascript
momo: {
  phoneNumber: 'SỐ_ĐIỆN_THOẠI_MOMO',        // Số điện thoại Momo của bạn
  accountName: 'TÊN_TÀI_KHOẢN',             // Tên hiển thị trên Momo
}
```

**Ví dụ:**
```javascript
momo: {
  phoneNumber: '0912345678',
  accountName: 'TRAN THI B',
}
```

## 📋 Danh sách mã ngân hàng (bankCode) phổ biến:

| Ngân hàng | Mã (bankCode) |
|-----------|---------------|
| Vietcombank | VCB |
| Techcombank | TCB |
| VPBank | VPB |
| BIDV | BIDV |
| Agribank | AGB |
| MB Bank | MB |
| ACB | ACB |
| VietinBank | CTG |
| Sacombank | STB |
| TPBank | TPB |
| HDBank | HDB |
| SHB | SHB |
| OCB | OCB |
| VIB | VIB |
| MSB | MSB |
| SeABank | SEAB |
| Eximbank | EIB |
| SCB | SCB |
| LienVietPostBank | LPB |
| BaoVietBank | BVB |

## ⚙️ Cấu hình nâng cao

### Thay đổi thời gian hiệu lực QR Code (mặc định 15 phút):

Tìm dòng code sau trong file `QRPayment.jsx`:

```javascript
const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes
```

Thay đổi số `15` thành số phút bạn muốn. Ví dụ:
- 10 phút: `10 * 60`
- 20 phút: `20 * 60`
- 30 phút: `30 * 60`

### Thay đổi tỷ lệ quy đổi xu (mặc định 1.000đ = 20 xu):

File cần sửa: `src/pages/TopUp.jsx`

Tìm và sửa mảng `topUpPackages` (dòng ~7):

```javascript
const topUpPackages = [
  { id: 1, amount: 50000, coins: 1000, popular: false },   // 50k = 1000 xu
  { id: 2, amount: 100000, coins: 2000, popular: false },  // 100k = 2000 xu
  // ... thêm hoặc sửa các gói
];
```

Công thức: `coins = (amount / 1000) * 20`

## 🔄 API Backend - Xác nhận thanh toán tự động

### Chế độ DEMO hiện tại:

Backend hiện đang ở chế độ DEMO - tự động xác nhận thanh toán sau **30 giây** để test.

File: `backend/routes/auth.js` - API `/check-payment-status` (dòng ~735)

```javascript
// DEMO: Tự động "thanh toán thành công" sau 30 giây
const paymentVerified = transactionAge > 30; // Giả lập thanh toán sau 30s
```

### Tích hợp thanh toán thực:

Để tích hợp thanh toán thực với VNPay/Momo, bạn cần:

1. **Đăng ký tài khoản merchant** với VNPay/Momo
2. **Lấy API credentials** (API Key, Secret Key, Merchant ID)
3. **Thay thế logic kiểm tra** bằng API calls thực tế

**Ví dụ tích hợp VNPay:**
```javascript
// Thay thế dòng:
const paymentVerified = transactionAge > 30;

// Bằng:
const paymentVerified = await checkVNPayTransaction(transactionCode);

// Function helper:
async function checkVNPayTransaction(transactionCode) {
  // Gọi API VNPay để kiểm tra trạng thái giao dịch
  const response = await fetch('VNPAY_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VNPAY_API_KEY}`
    },
    body: JSON.stringify({ transactionCode })
  });
  const data = await response.json();
  return data.status === 'success';
}
```

## 🎨 Thêm logo VNPay/Momo

### Thêm file ảnh:

1. Tải logo VNPay: Đặt vào `public/icons/vnpay.png`
2. Tải logo Momo: Đặt vào `public/icons/momo.png`

Logo sẽ tự động hiển thị trong giao diện chọn phương thức thanh toán.

## 🔐 Bảo mật

**LƯU Ý QUAN TRỌNG:**
- ❌ KHÔNG lưu API keys, secrets trong code frontend
- ✅ Luôn xử lý thanh toán ở backend
- ✅ Sử dụng environment variables (.env) cho thông tin nhạy cảm
- ✅ Implement webhook từ VNPay/Momo để nhận thông báo thanh toán tự động

## 📞 Hỗ trợ

Nếu cần hỗ trợ tích hợp API VNPay/Momo:
- VNPay: https://sandbox.vnpayment.vn/apis/docs/
- Momo: https://developers.momo.vn/

---

**Cập nhật cuối:** 2024

