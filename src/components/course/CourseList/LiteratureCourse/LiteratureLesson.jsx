import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const LessonLayout = ({
  courseName,
  lessons,
  currentLessonId,
  children,
  progressPercent,
  onPrev,
  onNext
}) => {
  const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 md:mb-0">
        <h2 className="text-lg font-bold mb-4 text-violet-700">{courseName}</h2>
        <nav className="space-y-2">
          {lessons.map((lesson, idx) => (
            <Link
              key={lesson.id}
              to={`/courses/7/${lesson.id}`}
              className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                lesson.id === currentLessonId
                  ? 'bg-violet-100 text-violet-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {idx + 1}. {lesson.title}
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Tiến độ</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-violet-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </aside>
      <main className="flex-1">
        {children}
        <div className="flex justify-between mt-8 gap-2">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 disabled:opacity-50"
          >
            ← Bài trước
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === lessons.length - 1}
            className="px-6 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:opacity-50"
          >
            Bài tiếp theo →
          </button>
        </div>
      </main>
    </div>
  );
};

const Content = ({ sections }) => (
  <div className="prose max-w-none">
    {sections.map((section, index) => (
      <motion.div
        key={index}
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {section.video && (
          <div className="rounded-lg overflow-hidden shadow mb-4">
            <iframe
              className="w-full h-64"
              src={section.video}
              title="Video bài giảng"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {section.text && <div className="text-gray-800 text-lg mb-2">{section.text}</div>}
        {section.example && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2">
            <div className="font-semibold text-blue-700 mb-1">Ví dụ</div>
            <div className="text-blue-900">{section.example}</div>
          </div>
        )}
        {section.note && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="font-semibold text-yellow-700 mb-1">Ghi nhớ</div>
            <div className="text-yellow-900">{section.note}</div>
          </div>
        )}
      </motion.div>
    ))}
  </div>
);

const LiteratureLesson = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/courses`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 6) {
          setLessons(data[6].lessons);
          const foundLesson = data[6].lessons.find(l => l.id === lessonId);
          setLesson(foundLesson);
        }
      })
      .catch(error => console.error('Error fetching lesson detail:', error));
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Không tìm thấy bài học</h1>
        <Link to="/courses/7" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
          Quay lại danh sách bài học
        </Link>
      </div>
    );
  }

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const progressPercent = lessons.length > 0 ? Math.round(((currentIndex + 1) / lessons.length) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <LessonLayout
        courseName="Ngữ Văn"
        lessons={lessons}
        currentLessonId={lessonId}
        progressPercent={progressPercent}
        onPrev={() => {
          if (currentIndex > 0) navigate(`/courses/7/${lessons[currentIndex - 1].id}`);
        }}
        onNext={() => {
          if (currentIndex < lessons.length - 1) navigate(`/courses/7/${lessons[currentIndex + 1].id}`);
        }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚖️</span>
            <h1 className="text-3xl font-bold text-violet-700">{lesson.title}</h1>
          </div>
          <div className="text-gray-500 text-sm mb-2">
            <Link to="/courses/7" className="hover:underline text-violet-600">Ngữ Văn</Link>
            <span className="mx-2">/</span>
            <span>{lesson.title}</span>
          </div>
        </div>
        <Content sections={lesson.sections} />
      </LessonLayout>
    </div>
  );
};

export default LiteratureLesson;
