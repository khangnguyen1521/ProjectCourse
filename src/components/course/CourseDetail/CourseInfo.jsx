// const CourseInfo = ({ course }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
//       <div className="flex items-center gap-4 mb-4">
//         <span className="text-gray-600">
//           <i className="far fa-clock"></i> {course.duration}
//         </span>
//         <span className="text-gray-600">
//           <i className="fas fa-user-graduate"></i> {course.students} Students
//         </span>
//         <span className="text-gray-600">
//           <i className="fas fa-star text-yellow-400"></i> {course.rating}
//         </span>
//       </div>
//       <div className="prose max-w-none">
//         <p>{course.description}</p>
//       </div>
//       <div className="mt-6">
//         <h3 className="text-xl font-semibold mb-2">What you'll learn</h3>
//         <ul className="grid grid-cols-2 gap-2">
//           {course.learningPoints.map((point, index) => (
//             <li key={index} className="flex items-center">
//               <i className="fas fa-check text-green-500 mr-2"></i>
//               {point}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   )
// }

// export default CourseInfo 