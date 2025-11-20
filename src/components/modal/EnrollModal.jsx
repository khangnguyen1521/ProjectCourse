import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../../config/api";

const EnrollModal = ({ isOpen, onClose, courseTitle, courseId, price, onSuccess }) => {
  const { user, updateProgress, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleEnroll = async () => {
    if (!user?.id) {
      setMessage({ type: 'error', text: 'Vui lòng đăng nhập để đăng ký khóa học' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/enroll-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: courseId,
          price: price || 0
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Đăng ký khóa học thành công!' });
        // Cập nhật tiến độ ban đầu
        await updateProgress(courseId, 0, 10);
        // Tự động cập nhật lại context user với logging
        if (data.coursesCompleted) {
          console.log('Updating user with new courses:', data.coursesCompleted);
          // Cập nhật cả coins và coursesCompleted
          login({ ...user, coursesCompleted: data.coursesCompleted, coins: data.coins });
        }
        setTimeout(() => {
          onClose();
          setMessage({ type: '', text: '' });
          // Gọi callback onSuccess nếu có (để chuyển hướng sang trang bài học)
          if (typeof onSuccess === 'function') {
            onSuccess();
          }
        }, 1000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra khi đăng ký khóa học' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi đăng ký khóa học' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký khóa học</h2>
              <p className="text-gray-600 mb-4">
                Bạn có muốn đăng ký khóa học <span className="font-semibold text-blue-600">{courseTitle}</span> không?
              </p>
              
              {/* Thông tin thanh toán */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá khóa học:</span>
                  <span className="text-lg font-bold text-blue-600">{price?.toLocaleString()} xu</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số xu hiện có:</span>
                  <span className="text-lg font-semibold text-gray-900">{user?.coins?.toLocaleString() || 0} xu</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                  <span className="text-gray-600">Số xu còn lại:</span>
                  <span className={`text-lg font-bold ${(user?.coins || 0) - (price || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {((user?.coins || 0) - (price || 0)).toLocaleString()} xu
                  </span>
                </div>
              </div>

              {/* Cảnh báo không đủ xu */}
              {(user?.coins || 0) < (price || 0) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <p className="text-sm">⚠️ Bạn không đủ xu để mua khóa học này!</p>
                </div>
              )}

              {/* Message */}
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-3 rounded-lg ${
                    message.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}

              <div className="flex justify-center space-x-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={loading || (user?.coins || 0) < (price || 0)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{loading ? 'Đang mua...' : 'Mua khóa học'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnrollModal;
