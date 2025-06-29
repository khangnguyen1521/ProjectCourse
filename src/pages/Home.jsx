import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const examCategories = [
    {
      id: 1,
      title: 'Bài kiểm tra Toán',
      subtitle: 'Đại số & Hình học',
      image: '/img/mathexam.png',
      gradient: 'from-purple-500 to-pink-500',
      icon: '📊',
      questions: '50 câu hỏi',
      duration: '60 phút'
    },
    {
      id: 2,
      title: 'Bài kiểm tra Vật lý',
      subtitle: 'Cơ học & Điện học',
      image: '/img/physicsExam.png',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '⚡',
      questions: '40 câu hỏi',
      duration: '45 phút'
    },
    {
      id: 3,
      title: 'Bài kiểm tra Tiếng Anh',
      subtitle: 'Ngữ pháp & Từ vựng',
      image: '/img/englishexam.png',
      gradient: 'from-green-500 to-emerald-500',
      icon: '📚',
      questions: '60 câu hỏi',
      duration: '75 phút'
    }
  ];

  const subjects = [
    {
      id: 1,
      title: 'Toán học',
      icon: '📊',
      description: 'Kiểm tra kiến thức Toán với bài kiểm tra được chuyên gia tạo ra',
      color: 'from-purple-500 to-pink-500',
      students: '2.5k+'
    },
    {
      id: 2,
      title: 'Tiếng Anh',
      icon: '📚',
      description: 'Luyện tập kỹ năng Tiếng Anh với bài kiểm tra chuyên nghiệp',
      color: 'from-blue-500 to-cyan-500',
      students: '3.2k+'
    },
    {
      id: 3,
      title: 'Khoa học',
      icon: '🔬',
      description: 'Khám phá khái niệm khoa học và kiểm tra kiến thức của bạn',
      color: 'from-green-500 to-emerald-500',
      students: '1.8k+'
    },
    {
      id: 4,
      title: 'Vật lý',
      icon: '⚡',
      description: 'Nắm vững cơ bản của Vật lý thông qua bài kiểm tra',
      color: 'from-orange-500 to-red-500',
      students: '2.1k+'
    },
    {
      id: 5,
      title: 'Kiến thức chung',
      icon: '🌍',
      description: 'Cập nhật thông tin và kiến thức chung mọi lĩnh vực',
      color: 'from-indigo-500 to-purple-500',
      students: '1.5k+'
    },
    {
      id: 6,
      title: 'Hóa học',
      icon: '🧪',
      description: 'Khám phá thế giới hóa học qua các bài kiểm tra tương tác',
      color: 'from-teal-500 to-blue-500',
      students: '1.9k+'
    }
  ];

  const stats = [
    { number: '50+', label: 'Khóa học' },
    { number: '200+', label: 'Bài kiểm tra' },
    { number: '10k+', label: 'Học sinh' },
    { number: '95%', label: 'Đánh giá' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/30 to-blue-100/30"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Học tập
                <br />
                <span className="text-gray-800">Thông minh</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Khám phá thế giới kiến thức với các khóa học và bài kiểm tra trực tuyến được thiết kế bởi chuyên gia hàng đầu
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Bắt đầu học ngay
                </motion.button>
              </Link>
              <Link to="/exams">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300"
                >
                  Làm bài kiểm tra
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-8 pt-8"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-purple-400 to-pink-400" />
                ))}
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã tham gia</p>
                <p className="text-lg font-semibold text-gray-800">10,000+ học sinh</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10">
              <img 
                src="/img/techingheader.png"
                alt="Online Learning"
                className="w-full max-w-lg mx-auto drop-shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Exam Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Bài kiểm tra nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chọn từ hàng trăm bài kiểm tra được thiết kế bởi chuyên gia giáo dục
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className="relative p-8">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.subtitle}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-6">
                      <span>{category.questions}</span>
                      <span>{category.duration}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 bg-gradient-to-r ${category.gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300`}
                    >
                      Bắt đầu ngay
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Khám phá môn học
              </h2>
              <p className="text-xl text-gray-600">
                Chọn môn học yêu thích và bắt đầu hành trình học tập
              </p>
            </div>
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
              >
                Xem tất cả
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="relative p-8">
                    <div className="text-5xl mb-6">{subject.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{subject.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{subject.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{subject.students} học sinh</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`px-6 py-2 bg-gradient-to-r ${subject.color} text-white font-semibold rounded-full text-sm hover:shadow-lg transition-all duration-300`}
                      >
                        Khám phá
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn học sinh khác và khám phá tiềm năng học tập của bạn
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                >
                  Đăng ký miễn phí
                </motion.button>
              </Link>
              <Link to="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  Xem khóa học
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;