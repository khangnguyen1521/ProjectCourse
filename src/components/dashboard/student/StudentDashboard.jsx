import EnrolledCourses from './EnrolledCourses'
import UpcomingExams from './UpcomingExams'
import Progress from './Progress'
import Achievements from './Achievements'

const StudentDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EnrolledCourses />
      <UpcomingExams />
      <Progress />
      <Achievements />
    </div>
  )
}

export default StudentDashboard 