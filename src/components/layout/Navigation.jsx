import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/courses', label: 'Khóa học' },
    { path: '/exams', label: 'Bài kiểm tra' },
    { path: '/topup', label: 'Nạp xu' },
    { path: '/dashboard', label: 'Bảng điều khiển' },
  ];

  return (
    <nav className="ml-6">
      <ul className="flex space-x-6">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`transition-colors font-medium ${
                isActive(link.path)
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 
