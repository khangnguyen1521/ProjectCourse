const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="block p-2 hover:bg-gray-100 rounded">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/my-courses" className="block p-2 hover:bg-gray-100 rounded">
              My Courses
            </a>
          </li>
          <li>
            <a href="/my-exams" className="block p-2 hover:bg-gray-100 rounded">
              My Exams
            </a>
          </li>
          <li>
            <a href="/profile" className="block p-2 hover:bg-gray-100 rounded">
              Profile
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar 