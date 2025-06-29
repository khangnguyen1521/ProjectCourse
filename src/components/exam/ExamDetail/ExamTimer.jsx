// src/exam/ExamDetails/ExamTimer.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ExamTimer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Chuyển phút -> giây

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // Hết giờ thì gọi hàm nộp bài
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return 'text-red-600 bg-red-100'; // Dưới 1 phút
    if (timeLeft <= 300) return 'text-orange-600 bg-orange-100'; // Dưới 5 phút
    return 'text-blue-600 bg-blue-100'; // Bình thường
  };

  const getTimeIcon = () => {
    if (timeLeft <= 60) return '⏰'; // Cảnh báo
    if (timeLeft <= 300) return '⏱️'; // Chú ý
    return '🕐'; // Bình thường
  };

  const getProgressPercentage = () => {
    const totalTime = duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <motion.div 
      className="flex items-center space-x-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${getTimeColor()}`}>
        <span className="text-lg">{getTimeIcon()}</span>
        <div>
          <div className="text-xs font-medium">Thời gian còn lại</div>
          <div className="text-lg font-bold">{formatTime(timeLeft)}</div>
        </div>
      </div>
      
      {/* Progress Circle */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <motion.path
            className={`${timeLeft <= 60 ? 'text-red-500' : timeLeft <= 300 ? 'text-orange-500' : 'text-blue-500'}`}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            initial={{ strokeDasharray: "100 100", strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 100 - getProgressPercentage() }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
      </div>

      {/* Warning for low time */}
      {timeLeft <= 60 && (
        <motion.div
          className="text-red-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          ⚠️ Hết giờ sắp đến!
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExamTimer;