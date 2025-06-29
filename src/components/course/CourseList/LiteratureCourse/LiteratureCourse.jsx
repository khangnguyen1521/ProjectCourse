import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const LessonCard = ({ id, title, description }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          to={`/courses/7/${id}`}
          className="inline-block bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition-colors duration-300"
        >
          Bắt đầu học
        </Link>
      </div>
    </div>
);

const LiteratureCourse = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/courses`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setLessons(data[6].lessons);  // Lấy lessons của khóa học Literature
        }
      })
      .catch(error => console.error('Error fetching lessons:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Khóa Học Ngữ Văn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} {...lesson} />
        ))}
      </div>
    </div>
  );
};

export default LiteratureCourse;
