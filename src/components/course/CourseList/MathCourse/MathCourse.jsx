import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../config/api';

const LessonCard = ({ id, title, description }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        to={`/courses/1/${id}`}
        className="inline-block bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition-colors duration-300"
      >
        Bắt đầu học
      </Link>
    </div>
  </div>
);

const MathCourse = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch(`${API_ENDPOINTS.COURSES}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setLessons(data[0].lessons);  // Lấy lessons của khóa học Math
        }
      })
      .catch(error => console.error('Error fetching lessons:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Khóa Học Toán</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} {...lesson} />
        ))}
      </div>
    </div>
  );
};

export default MathCourse; 
