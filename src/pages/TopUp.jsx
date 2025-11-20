import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import QRPayment from '../components/payment/QRPayment';

// Gói nạp xu - Tỷ lệ: 1.000đ = 20 xu
const topUpPackages = [
  { id: 1, amount: 50000, coins: 1000, popular: false },
  { id: 2, amount: 100000, coins: 2000, popular: false },
  { id: 3, amount: 200000, coins: 4000, popular: true },
  { id: 4, amount: 500000, coins: 10000, popular: false },
  { id: 5, amount: 1000000, coins: 20000, popular: false },
  { id: 6, amount: 2000000, coins: 40000, popular: false },
];

const TopUp = () => {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'vnpay' or 'momo'
  const [showQR, setShowQR] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');

  // Generate transaction code
  useEffect(() => {
    if (selectedPackage && paymentMethod) {
      const code = `${user?.id?.slice(-6) || 'USER'}-${Date.now().toString().slice(-8)}`;
      setTransactionCode(code);
    }
  }, [selectedPackage, paymentMethod, user]);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setPaymentMethod(null);
    setShowQR(false);
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    setShowQR(true);
  };

  const handleBackToPackages = () => {
    setSelectedPackage(null);
    setPaymentMethod(null);
    setShowQR(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nạp Xu
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Nạp xu để mua các khóa học yêu thích của bạn
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="inline-flex items-center bg-blue-50 px-6 py-3 rounded-lg border border-blue-200">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="text-lg text-gray-700">Số xu hiện có: <strong className="text-blue-600">{user?.coins?.toLocaleString() || 0} xu</strong></span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {!selectedPackage ? (
            // Packages Selection
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Chọn gói nạp xu</h2>
                <p className="text-gray-600">Tỷ lệ quy đổi: <strong>1.000đ = 20 xu</strong></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topUpPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`relative bg-white rounded-xl shadow-md border-2 ${
                      pkg.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                    } p-6 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all duration-300`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Phổ biến
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {formatCurrency(pkg.amount)}
                      </h3>
                      
                      <div className="flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-3xl font-bold text-blue-600">
                          {pkg.coins.toLocaleString()} xu
                        </span>
                      </div>
                      
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Chọn gói này
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : !paymentMethod ? (
            // Payment Method Selection
            <motion.div
              key="payment-method"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={handleBackToPackages}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại chọn gói
              </button>

              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Thông tin gói nạp</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(selectedPackage.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Số xu nhận được:</span>
                      <span className="text-xl font-bold text-blue-600">{selectedPackage.coins.toLocaleString()} xu</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Tỷ lệ quy đổi:</span>
                      <span className="font-semibold text-gray-900">1.000đ = 20 xu</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn phương thức thanh toán</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* VNPay */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPaymentMethod('vnpay')}
                    className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all border-2 border-gray-200"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src="/icons/vnpay.png" alt="VNPay" className="w-12 h-12" onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="text-3xl font-bold text-blue-600">VP</span>';
                        }} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">VNPay</h4>
                      <p className="text-gray-600 text-sm">Thanh toán qua VNPay QR</p>
                    </div>
                  </motion.div>

                  {/* Momo */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPaymentMethod('momo')}
                    className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:border-pink-500 transition-all border-2 border-gray-200"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src="/icons/momo.png" alt="Momo" className="w-12 h-12" onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="text-3xl font-bold text-pink-600">M</span>';
                        }} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Momo</h4>
                      <p className="text-gray-600 text-sm">Thanh toán qua Momo QR</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            // QR Payment
            <QRPayment
              paymentMethod={paymentMethod}
              amount={selectedPackage.amount}
              coins={selectedPackage.coins}
              transactionCode={transactionCode}
              onBack={() => setPaymentMethod(null)}
              onCancel={handleBackToPackages}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TopUp;

