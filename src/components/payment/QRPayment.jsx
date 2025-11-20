import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../../config/api';

const QRPayment = ({ paymentMethod, amount, coins, transactionCode, onBack, onCancel }) => {
  const { user, login } = useAuth();
  const [qrUrl, setQrUrl] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed
  const [message, setMessage] = useState({ type: '', text: '' });

  // Payment configuration - User có thể thay đổi sau
  const paymentConfig = {
    vnpay: {
      accountNo: '0091000671434',
      accountName: 'NGUYEN MINH KHANG',
      bankName: 'Vietcombank',
      bankCode: 'VCB',
    },
    momo: {
      phoneNumber: '0583496990',
      accountName: 'NGUYEN MINH KHANG',
    }
  };

  // Generate QR URL
  const generateQRUrl = useCallback(() => {
    const config = paymentConfig[paymentMethod];
    let qrContent = '';

    if (paymentMethod === 'vnpay') {
      // VNPay QR format
      qrContent = `https://img.vietqr.io/image/${config.bankCode}-${config.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(`NAP XU ${transactionCode}`)}&accountName=${encodeURIComponent(config.accountName)}`;
    } else if (paymentMethod === 'momo') {
      // Momo QR format
      qrContent = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(`2|99|${config.phoneNumber}|${config.accountName}|${amount}|NAP XU ${transactionCode}`)}`;
    }

    setQrUrl(qrContent);
  }, [paymentMethod, amount, transactionCode]);

  // Initialize QR
  useEffect(() => {
    generateQRUrl();
  }, [generateQRUrl]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      generateQRUrl(); // Regenerate QR
      setTimeRemaining(15 * 60); // Reset timer
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, generateQRUrl]);

  // Auto-check payment status every 10 seconds
  useEffect(() => {
    if (paymentStatus === 'pending') {
      const checkInterval = setInterval(() => {
        checkPaymentStatus();
      }, 10000); // Check every 10 seconds

      return () => clearInterval(checkInterval);
    }
  }, [paymentStatus]);

  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check payment status
  const checkPaymentStatus = async () => {
    if (checking) return;
    
    setChecking(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/check-payment-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          transactionCode,
          paymentMethod,
          amount,
          coins
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setPaymentStatus('success');
        setMessage({ type: 'success', text: `Nạp xu thành công! Bạn đã nhận được ${coins.toLocaleString()} xu.` });
        
        // Update user coins in context
        login({ ...user, coins: data.newBalance });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          onCancel();
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking payment:', error);
    } finally {
      setChecking(false);
    }
  };

  // Manual refresh QR
  const handleRefreshQR = () => {
    setLoading(true);
    generateQRUrl();
    setTimeRemaining(15 * 60);
    setTimeout(() => setLoading(false), 500);
  };

  // Copy transaction code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(transactionCode);
    setMessage({ type: 'success', text: 'Đã sao chép mã giao dịch!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const config = paymentConfig[paymentMethod];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Chọn phương thức khác
      </button>

      {paymentStatus === 'success' ? (
        // Success State
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-6">{message.text}</p>
          <button
            onClick={onCancel}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Hoàn tất
          </button>
        </motion.div>
      ) : (
        // Payment State
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quét mã QR để thanh toán
              </h2>
              <p className="text-gray-600">
                Sử dụng ứng dụng {paymentMethod === 'vnpay' ? 'ngân hàng' : 'Momo'} để quét mã
              </p>
            </div>

            {/* QR Code */}
            <div className="relative bg-gray-50 rounded-xl p-6 mb-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="w-64 h-64 object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=QR+Code';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeRemaining <= 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">
                  Mã QR còn hiệu lực: {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Mã QR sẽ tự động làm mới sau 15 phút</p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefreshQR}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Làm mới mã QR</span>
            </button>
          </div>

          {/* Payment Info Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin thanh toán</h3>

            {/* Transaction Info */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Số tiền:</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Số xu nhận:</span>
                <span className="text-xl font-bold text-blue-600">{coins.toLocaleString()} xu</span>
              </div>
              <div className="py-3 border-b">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Sao chép
                  </button>
                </div>
                <code className="bg-gray-100 px-3 py-2 rounded block text-center font-mono text-sm">
                  {transactionCode}
                </code>
              </div>
            </div>

            {/* Bank/Momo Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                {paymentMethod === 'vnpay' ? 'Thông tin tài khoản' : 'Thông tin Momo'}
              </h4>
              {paymentMethod === 'vnpay' ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">{config.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-medium">{config.accountNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-medium">{config.accountName}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="font-medium">{config.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên tài khoản:</span>
                    <span className="font-medium">{config.accountName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Lưu ý quan trọng
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Vui lòng chuyển <strong>ĐÚNG số tiền</strong> và <strong>nội dung</strong></li>
                <li>• Nội dung: <code className="bg-yellow-100 px-1">NAP XU {transactionCode}</code></li>
                <li>• Xu sẽ được cộng tự động sau khi thanh toán thành công</li>
                <li>• Thời gian xử lý: 1-5 phút</li>
              </ul>
            </div>

            {/* Status Message */}
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            {/* Check Status Button */}
            <button
              onClick={checkPaymentStatus}
              disabled={checking}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {checking && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{checking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}</span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Hủy giao dịch
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QRPayment;

