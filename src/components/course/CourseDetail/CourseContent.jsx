// const CourseContent = ({ modules }) => {
//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-bold mb-4">Course Content</h2>
//       <div className="space-y-4">
//         {modules.map((module, index) => (
//           <div key={index} className="border rounded-lg">
//             <div className="p-4 bg-gray-50 font-medium">
//               {module.title}
//             </div>
//             <div className="p-4">
//               {module.lessons.map((lesson, lessonIndex) => (
//                 <div key={lessonIndex} className="flex items-center justify-between py-2">
//                   <div className="flex items-center">
//                     <i className="fas fa-play-circle mr-2 text-primary-500"></i>
//                     <span>{lesson.title}</span>
//                   </div>
//                   <span className="text-sm text-gray-500">{lesson.duration}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default CourseContent 