const Navigation = () => {
  return (
    <nav className="ml-6">
      <ul className="flex space-x-6">
        <li><a href="/" className="hover:text-primary-500">Trang chủ</a></li>
        <li><a href="/courses" className="hover:text-primary-500">Khóa học</a></li>
        <li><a href="/exams" className="hover:text-primary-500">Bài kiểm tra</a></li>
        <li><a href="/dashboard" className="hover:text-primary-500">Bảng điều khiển</a></li>
      </ul>
    </nav>
  )
}

export default Navigation 
