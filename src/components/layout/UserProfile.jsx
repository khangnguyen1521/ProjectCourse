import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [user]);

  if (!user) {
    return (
      <Link
        to="/login"
        className="bg-violet-400 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition-colors"
      >
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <img
          src={'/img/avt.png'}
          alt="User"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{user.name}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Thông tin cá nhân
          </Link>

          {/*Chỉ admin mới thấy link User Management */}
          {user.role === 'admin' && (
            <Link
              to="/user-management"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Quản lý người dùng
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* Overlay để click ra ngoài đóng dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;