import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import EnrollModal from "../components/modal/EnrollModal";

const courses = [
  {
    id: 1,
    title: "Toán học",
    shortTitle: "Toán",
    courseId: "Math",
    description: "Khám phá thế giới của các con số và hình học, nơi logic và sự sáng tạo gặp nhau để giải quyết những vấn đề thú vị và thực tiễn.",
    image: "/img/mathcourse.png",
    category: "Khoa học tự nhiên",
    duration: "12 tuần",
    lessons: 48,
    level: "Trung bình",
    rating: 4.8,
    students: 1250,
    price: "Miễn phí",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 2,
    title: "Vật lý",
    shortTitle: "Lý",
    courseId: "Physics",
    description: "Hiểu về thế giới xung quanh bạn thông qua các hiện tượng vật lý, từ chuyển động của vật thể đến những bí ẩn của ánh sáng và âm thanh.",
    image: "/img/physicscourse.png",
    category: "Khoa học tự nhiên",
    duration: "10 tuần",
    lessons: 40,
    level: "Trung bình",
    rating: 4.7,
    students: 980,
    price: "Miễn phí",
    color: "from-yellow-600 to-yellow-800",
  },
  {
    id: 3,
    title: "Hóa học",
    shortTitle: "Hóa",
    courseId: "Chemistry",
    description: "Khám phá thế giới đầy hấp dẫn của vật chất, nguyên tử và các phản ứng hóa học hình thành nên mọi thứ xung quanh chúng ta.",
    image: "/img/chemistrycourse.png",
    category: "Khoa học tự nhiên",
    duration: "8 tuần",
    lessons: 32,
    level: "Khó",
    rating: 4.6,
    students: 750,
    price: "Miễn phí",
    color: "from-teal-600 to-teal-800",
  },
  {
    id: 4,
    title: "Sinh học",
    shortTitle: "Sinh",
    courseId: "Biology",
    description: "Khám phá thế giới tuyệt vời của các sinh vật sống, từ những tế bào hiển vi đến các hệ sinh thái phức tạp.",
    image: "/img/biologycourse.png",
    category: "Khoa học tự nhiên",
    duration: "15 tuần",
    lessons: 60,
    level: "Trung bình",
    rating: 4.9,
    students: 1100,
    price: "Miễn phí",
    color: "from-green-500 to-green-700",
  },
  {
    id: 5,
    title: "Lịch sử",
    shortTitle: "Sử",
    courseId: "History",
    description: "Khám phá quá khứ của nền văn minh nhân loại, từ thời cổ đại đến xã hội hiện đại. Tìm hiểu về các sự kiện, nhân vật và văn hóa đã hình thành nên thế giới ngày nay.",
    image: "/img/historycourse.png",
    category: "Khoa học xã hội",
    duration: "12 tuần",
    lessons: 45,
    level: "Dễ",
    rating: 4.5,
    students: 890,
    price: "Miễn phí",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 6,
    title: "Địa lý",
    shortTitle: "Địa",
    courseId: "Geography",
    description: "Nghiên cứu các cảnh quan, môi trường của Trái Đất và mối quan hệ giữa con người với môi trường xung quanh họ.",
    image: "/img/geographycourse.png",
    category: "Khoa học xã hội",
    duration: "10 tuần",
    lessons: 38,
    level: "Dễ",
    rating: 4.4,
    students: 650,
    price: "Miễn phí",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: 7,
    title: "Ngữ văn",
    shortTitle: "Văn",
    courseId: "Literature",
    description: "Khám phá thế giới của ngôn ngữ, văn học và nghệ thuật. Tìm hiểu về các tác phẩm văn học nổi tiếng, phong cách viết và cách mà ngôn ngữ ảnh hưởng đến tư duy và cảm xúc.",
    image: "/img/literaturecourse.png",
    category: "Khoa học xã hội",
    duration: "14 tuần",
    lessons: 52,
    level: "Trung bình",
    rating: 4.7,
    students: 1200,
    price: "Miễn phí",
    color: "from-purple-600 to-purple-800",
  },
  {
    id: 8,
    title: "Giáo dục công dân",
    shortTitle: "GDCD",
    courseId: "Civic",
    description: "Học về quyền và nghĩa vụ của công dân, hiểu luật pháp, đạo đức và các giá trị xã hội.",
    image: "/img/civiccourse.png",
    category: "Khoa học xã hội",
    duration: "8 tuần",
    lessons: 30,
    level: "Dễ",
    rating: 4.3,
    students: 520,
    price: "Miễn phí",
    color: "from-pink-600 to-pink-800",
  },
  {
    id: 9,
    title: "Tiếng Anh",
    shortTitle: "Anh",
    courseId: "English",
    description: "Thông thạo ngôn ngữ toàn cầu của giao tiếp, văn hóa và sự kết nối.",
    image: "/img/englishcourse.png",
    category: "Khoa học xã hội",
    duration: "16 tuần",
    lessons: 64,
    level: "Trung bình",
    rating: 4.8,
    students: 1800,
    price: "Miễn phí",
    color: "from-indigo-500 to-indigo-700",
  },
];

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCourseClick = (course) => {
    if (!user) {
      alert("Bạn cần đăng nhập để xem nội dung khóa học");
      navigate("/login");
      return;
    }

    // Kiểm tra xem user đã đăng ký khóa học này chưa
    const hasEnrolled = user.coursesCompleted?.includes(course.courseId);
    
    if (hasEnrolled) {
      // Nếu đã đăng ký, chuyển đến trang khóa học
      navigate(`/courses/${course.id}`);
    } else {
      // Nếu chưa đăng ký, hiển thị modal đăng ký
      setSelectedCourse(course);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleModalSuccess = () => {
    // Sau khi đăng ký thành công, chuyển đến trang khóa học
    if (selectedCourse) {
      navigate(`/courses/${selectedCourse.id}`);
    }
  };

  // Lọc khóa học theo category và search term
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "Tất cả" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case "Dễ":
        return "bg-green-100 text-green-800";
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800";
      case "Khó":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    return category === activeCategory
      ? "bg-blue-600 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Khám phá khóa học
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Chọn khóa học phù hợp với sở thích và mục tiêu học tập của bạn. 
              Tất cả khóa học đều miễn phí và được thiết kế bởi các chuyên gia hàng đầu.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-0 rounded-full shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["Tất cả", "Khoa học tự nhiên", "Khoa học xã hội"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${getCategoryColor(category)}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleCourseClick(course)}
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${course.color}`}>
                  {course.price}
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      {course.lessons} bài học
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {course.rating}
                  </div>
                </div>

                {/* Enrollment Status */}
                {user && (
                  <div className="mb-4">
                    {user.coursesCompleted?.includes(course.courseId) ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Đã đăng ký</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="font-medium">Chưa đăng ký</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  {user?.coursesCompleted?.includes(course.courseId) ? 'Tiếp tục học' : 'Đăng ký ngay'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
          </motion.div>
        )}
      </div>

      {/* Enroll Modal */}
      <EnrollModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        courseTitle={selectedCourse?.title}
        courseId={selectedCourse?.courseId}
      />
    </div>
  );
};

export default Courses;