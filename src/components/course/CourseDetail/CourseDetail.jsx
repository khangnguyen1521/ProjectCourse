import React from 'react';
import { useParams, Routes, Route } from 'react-router-dom';
import MathCourse from '../CourseList/MathCourse/MathCourse';
import MathLesson from '../CourseList/MathCourse/MathLesson';
import PhysicsCourse from '../CourseList/PhysicsCourse/PhysicsCourse';
import PhysicsLesson from '../CourseList/PhysicsCourse/PhysicsLesson';
import BiologyCourse from '../CourseList/BiologyCourse/BiologyCourse';
import BiologyLesson from '../CourseList/BiologyCourse/BiologyLesson';
import ChemistryCourse from '../CourseList/ChemistryCourse/ChemistryCourse';
import ChemistryLesson from '../CourseList/ChemistryCourse/ChemistryLesson';
import HistoryCourse from '../CourseList/HistoryCourse/HistoryCourse';
import HistoryLesson from '../CourseList/HistoryCourse/HistoryLesson';
import GeographyCourse from '../CourseList/GeographyCourse/GeographyCourse';
import GeographyLesson from '../CourseList/GeographyCourse/GeographyLesson';
import LiteratureCourse from '../CourseList/LiteratureCourse/LiteratureCourse';
import LiteratureLesson from '../CourseList/LiteratureCourse/LiteratureLesson';
import CivicCourse from '../CourseList/CivicCourse/CivicCourse';
import CivicLesson from '../CourseList/CivicCourse/CivicLesson';
import EnglishCourse from '../CourseList/EnglishCourse/EnglishCourse';
import EnglishLesson from '../CourseList/EnglishCourse/EnglishLesson';


const CourseDetail = () => {
  const { id } = useParams();

  // (id = 1) is Math 
  if (id === "1") {
    return (
      <div>
        <Routes>
          <Route index element={<MathCourse />} />
          <Route path=":lessonId" element={<MathLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "2") {
    return (
      <div>
        <Routes>
          <Route index element={<PhysicsCourse />} />
          <Route path=":lessonId" element={<PhysicsLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "3") {
    return (
      <div>
        <Routes>
          <Route index element={<ChemistryCourse />} />
          <Route path=":lessonId" element={<ChemistryLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "4") {
    return (
      <div>
        <Routes>
          <Route index element={<BiologyCourse />} />
          <Route path=":lessonId" element={<BiologyLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "5") {
    return (
      <div>
        <Routes>
          <Route index element={<HistoryCourse />} />
          <Route path=":lessonId" element={<HistoryLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "6") {
    return (
      <div>
        <Routes>
          <Route index element={<GeographyCourse />} />
          <Route path=":lessonId" element={<GeographyLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "7") {
    return (
      <div>
        <Routes>
          <Route index element={<LiteratureCourse />} />
          <Route path=":lessonId" element={<LiteratureLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "8") {
    return (
      <div>
        <Routes>
          <Route index element={<CivicCourse />} />
          <Route path=":lessonId" element={<CivicLesson />} />
        </Routes>
      </div>
    );
  }
  if (id === "9") {
    return (
      <div>
        <Routes>
          <Route index element={<EnglishCourse />} />
          <Route path=":lessonId" element={<EnglishLesson />} />
        </Routes>
      </div>
    );
  }

  // For other course
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center">
        Nội dung khóa học đang được phát triển
      </h1>
    </div>
  );
};

export default CourseDetail;