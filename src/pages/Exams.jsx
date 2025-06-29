import { useState, useEffect } from "react";
import ExamTimer from "../components/exam/ExamDetail/ExamTimer";
import QuestionList from "../components/exam/ExamDetail/QuestionList";
import { 
  mathQuestions, 
  physicsQuestions, 
  chemistryQuestions, 
  biologyQuestions,
  historyQuestions,
  geographyQuestions,
  civicsQuestions,
  literatureQuestions,
  englishQuestions
} from "../components/exam/ExamDetail/Question";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "../config/api";

// Bảng ánh xạ giữa tên môn thi và courseId trong hệ thống
const subjectToCourseMap = {
  "Toán học": "Math",
  "Vật lý": "Physics",
  "Hóa học": "Chemistry",
  "Sinh học": "Biology",
  "Ngữ văn": "Literature",
  "Tiếng Anh": "English",
  "Lịch sử": "History",
  "Địa lý": "Geography",
  "Giáo dục công dân": "Civic"
};

// Phân chia các môn học thành nhóm
const subjectGroups = [
  {
    name: "Khoa học Tự nhiên",
    subjects: [
      { label: "Toán học", questions: mathQuestions, icon: "🧮", color: "from-amber-500 to-orange-600", duration: "30 phút", questionsCount: mathQuestions.length },
      { label: "Vật lý", questions: physicsQuestions, icon: "⚡", color: "from-yellow-600 to-yellow-800", duration: "25 phút", questionsCount: physicsQuestions.length },
      { label: "Hóa học", questions: chemistryQuestions, icon: "🧪", color: "from-teal-600 to-teal-800", duration: "25 phút", questionsCount: chemistryQuestions.length },
      { label: "Sinh học", questions: biologyQuestions, icon: "🧬", color: "from-green-500 to-green-700", duration: "30 phút", questionsCount: biologyQuestions.length },
    ]
  },
  {
    name: "Khoa học Xã hội & Ngôn ngữ",
    subjects: [
      { label: "Ngữ văn", questions: literatureQuestions, icon: "📖", color: "from-purple-600 to-purple-800", duration: "35 phút", questionsCount: literatureQuestions.length },
      { label: "Tiếng Anh", questions: englishQuestions, icon: "🇺🇸", color: "from-indigo-500 to-indigo-700", duration: "30 phút", questionsCount: englishQuestions.length },
      { label: "Lịch sử", questions: historyQuestions, icon: "📚", color: "from-orange-500 to-red-600", duration: "25 phút", questionsCount: historyQuestions.length },
      { label: "Địa lý", questions: geographyQuestions, icon: "🌍", color: "from-blue-500 to-blue-700", duration: "25 phút", questionsCount: geographyQuestions.length },
      { label: "Giáo dục công dân", questions: civicsQuestions, icon: "⚖️", color: "from-pink-600 to-pink-800", duration: "20 phút", questionsCount: civicsQuestions.length },
    ]
  }
];

// Tạo danh sách tất cả các môn học để sử dụng khi tìm câu hỏi
const allSubjects = subjectGroups.flatMap(group => group.subjects);

const ExamPage = () => {
  const { user, login } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Cập nhật danh sách khóa học đã đăng ký mỗi khi user thay đổi
  useEffect(() => {
    if (user && user.coursesCompleted) {
      setEnrolledCourses(user.coursesCompleted);
      console.log('Enrolled courses updated:', user.coursesCompleted);
    }
  }, [user]);

  // Kiểm tra người dùng đã đăng ký khóa học chưa
  const isEnrolled = (subjectName) => {
    if (user && user.role === 'admin') return true;
    const courseId = subjectToCourseMap[subjectName];
    const enrolled = enrolledCourses.includes(courseId);
    console.log(`Checking enrollment for ${subjectName} (${courseId}):`, enrolled, 'Enrolled courses:', enrolledCourses);
    return enrolled;
  };

  const handleStart = () => {
    if (!selectedSubject) {
      alert("Bạn phải chọn môn thi trước!");
      return;
    }
    
    if (!isEnrolled(selectedSubject)) {
      const courseId = subjectToCourseMap[selectedSubject];
      alert(`Bạn cần đăng ký khóa học ${selectedSubject} trước khi làm bài kiểm tra!\n\nVui lòng vào trang "Khóa học" để đăng ký.`);
      return;
    }
    
    setShowInstructions(true);
  };

  const handleConfirmStart = () => {
    setShowInstructions(false);
    setIsStarted(true);
  };

  const handleSubmit = async (userAnswers) => {
    const subjectObj = allSubjects.find((s) => s.label === selectedSubject);
    let correct = 0;
  
    subjectObj.questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) {
        correct += 1;
      }
    });
  
    const calculatedScore = (correct / subjectObj.questions.length) * 10;
    setScore(calculatedScore);
    setIsSubmitted(true);
  
    try {
              const response = await axios.post(`${API_ENDPOINTS.AUTH}/submit-exam`, {
        userId: user.id,
        courseId: selectedSubject,
        score: calculatedScore,
      });
  
      let updatedExamResults;
      
      if (response.data.kept) {
        alert(`Điểm lần này (${calculatedScore.toFixed(1)}) không cao hơn lần trước (${response.data.oldScore.toFixed(1)}). Giữ nguyên điểm cũ!`);
        updatedExamResults = [...(user.examResults || [])];
      } else if (response.data.updated) {
        const newResults = [...(user.examResults || [])];
        const existingIndex = newResults.findIndex(
          result => result.courseId === selectedSubject
        );
        
        if (existingIndex !== -1) {
          newResults[existingIndex].score = calculatedScore;
        }
        
        updatedExamResults = newResults;
        alert(`Điểm mới cao hơn! Đã cập nhật thành ${calculatedScore.toFixed(1)}/10`);
      } else {
        updatedExamResults = [
          ...(user.examResults || []),
          { courseId: selectedSubject, score: calculatedScore },
        ];
        alert("Nộp bài thành công!");
      }
  
      const updatedUser = {
        ...user,
        examResults: updatedExamResults,
      };
  
      login(updatedUser);
    } catch (error) {
      console.error("Submit exam error:", error);
      alert("Lỗi khi lưu kết quả!");
    }
  };

  const handleTimeUp = () => {
    if (!isSubmitted) {
      alert("Hết giờ! Bài thi sẽ tự động nộp.");
      document.querySelector("form")?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 9) return 'Xuất sắc! Bạn đã nắm vững kiến thức.';
    if (score >= 7) return 'Tốt! Bạn đã đạt yêu cầu.';
    if (score >= 5) return 'Đạt! Bạn cần cố gắng thêm.';
    return 'Chưa đạt. Hãy ôn tập lại kiến thức.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Bài kiểm tra kiến thức
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Kiểm tra và đánh giá kiến thức của bạn thông qua các bài thi trực tuyến
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isStarted ? (
          <div className="space-y-8">
            {/* Subject Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">📝</span>
                <h2 className="text-2xl font-bold text-gray-900">Chọn môn thi</h2>
              </div>
              
              <div className="space-y-8">
                {subjectGroups.map((group, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.subjects.map((subject) => {
                        const enrolled = isEnrolled(subject.label);
                        return (
                          <motion.div
                            key={subject.label}
                            className={`relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                              selectedSubject === subject.label 
                                ? 'border-blue-500 shadow-lg scale-105' 
                                : enrolled 
                                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                  : 'border-gray-200 opacity-60 cursor-not-allowed'
                            }`}
                            onClick={() => enrolled && setSelectedSubject(subject.label)}
                            whileHover={enrolled ? { scale: 1.02 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r ${subject.color} opacity-10`}></div>
                            <div className="relative p-6">
                              <div className="flex items-center space-x-4">
                                <div className="text-3xl">{subject.icon}</div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{subject.label}</h4>
                                  <div className="text-sm text-gray-500 space-y-1">
                                    <p>⏱️ {subject.duration}</p>
                                    <p>📋 {subject.questionsCount} câu hỏi</p>
                                  </div>
                                  {!enrolled && (
                                    <p className="text-xs text-red-500 mt-2">Chưa đăng ký khóa học</p>
                                  )}
                                </div>
                                {selectedSubject === subject.label && (
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleStart}
                  disabled={!selectedSubject || !isEnrolled(selectedSubject)}
                  className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform ${
                    selectedSubject && isEnrolled(selectedSubject) 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!selectedSubject 
                    ? 'Chọn môn thi để bắt đầu' 
                    : isEnrolled(selectedSubject) 
                      ? 'Bắt đầu làm bài kiểm tra' 
                      : 'Hãy đăng ký khóa học trước'
                  }
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Exam Header */}
            {!isSubmitted && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl text-white">
                        {allSubjects.find((s) => s.label === selectedSubject)?.icon}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedSubject} - Bài kiểm tra
                      </h2>
                      <p className="text-sm text-gray-500">
                        {allSubjects.find((s) => s.label === selectedSubject)?.questionsCount} câu hỏi
                      </p>
                    </div>
                  </div>
                  <ExamTimer duration={5} onTimeUp={handleTimeUp} />
                </div>
              </div>
            )}
            
            {/* Exam Content */}
            {!isSubmitted ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <QuestionList
                  questions={allSubjects.find((s) => s.label === selectedSubject).questions}
                  onSubmit={handleSubmit}
                />
              </div>
            ) : (
              <motion.div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
                  {score >= 8 ? (
                    <span className="text-5xl">🎉</span>
                  ) : score >= 5 ? (
                    <span className="text-5xl">✅</span>
                  ) : (
                    <span className="text-5xl">📚</span>
                  )}
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Kết quả bài kiểm tra</h2>
                
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl mb-8">
                  <p className="text-lg mb-4">
                    Môn học: <span className="font-bold text-blue-600">{selectedSubject}</span>
                  </p>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(1)}
                    </div>
                    <div className="text-gray-400 text-2xl ml-2">/10</div>
                  </div>
                  
                  <p className="text-gray-600 text-lg">
                    {getScoreMessage(score)}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setIsStarted(false);
                      setIsSubmitted(false);
                      setSelectedSubject("");
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Làm bài khác
                  </button>
                  <button
                    onClick={() => {
                      setIsStarted(false);
                      setIsSubmitted(false);
                      setSelectedSubject("");
                    }}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Về trang chủ
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Hướng dẫn làm bài</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">1.</span>
                <p className="text-gray-600">Đọc kỹ câu hỏi trước khi chọn đáp án</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">2.</span>
                <p className="text-gray-600">Bạn có thể thay đổi đáp án trước khi nộp bài</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">3.</span>
                <p className="text-gray-600">Bài thi sẽ tự động nộp khi hết thời gian</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 font-bold">4.</span>
                <p className="text-gray-600">Chỉ điểm cao nhất sẽ được lưu</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInstructions(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmStart}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Bắt đầu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
