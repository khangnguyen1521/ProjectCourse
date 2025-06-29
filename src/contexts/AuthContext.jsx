import { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Kiểm tra localStorage khi khởi động
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setDashboardStats(null);
    localStorage.removeItem('user');
  };

  // API: Lấy thống kê dashboard
  const fetchDashboardStats = async () => {
    if (!user?.id) {
      console.log('No user ID found:', user);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching dashboard stats for user:', user.id);
      const response = await fetch(`${API_ENDPOINTS.AUTH}/dashboard-stats/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard stats received:', data);
        setDashboardStats(data);
      } else {
        console.error('Failed to fetch dashboard stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thống kê dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // API: Cập nhật tiến độ học tập
  const updateProgress = async (courseId, completedLessons, totalLessons = 10) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/update-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          courseId,
          completedLessons,
          totalLessons
        }),
      });

      if (response.ok) {
        // Cập nhật lại thống kê dashboard
        await fetchDashboardStats();
        return true;
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật tiến độ:', error);
    }
    return false;
  };

  // API: Cập nhật thông tin cá nhân
  const updateProfile = async (profileData) => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...profileData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Cập nhật thông tin user trong context
        setUser(prevUser => ({
          ...prevUser,
          ...data.user
        }));
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...data.user
        }));
        return true;
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
    }
    return false;
  };

  // API: Lấy danh sách khóa học của user
  const fetchUserCourses = async () => {
    if (!user?.id) {
      console.log('No user ID found for courses:', user);
      return [];
    }
    
    try {
      console.log('Fetching user courses for user:', user.id);
      const response = await fetch(`${API_ENDPOINTS.AUTH}/user-courses/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('User courses received:', data);
        return data;
      } else {
        console.error('Failed to fetch user courses:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học:', error);
    }
    return [];
  };

  // API: Lấy danh sách bài kiểm tra của user
  const fetchUserExams = async () => {
    if (!user?.id) {
      console.log('No user ID found for exams:', user);
      return [];
    }
    
    try {
      console.log('Fetching user exams for user:', user.id);
      const response = await fetch(`${API_ENDPOINTS.AUTH}/user-exams/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('User exams received:', data);
        return data;
      } else {
        console.error('Failed to fetch user exams:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài kiểm tra:', error);
    }
    return [];
  };

  // Tự động lấy thống kê dashboard khi user đăng nhập
  useEffect(() => {
    if (user?.id) {
      fetchDashboardStats();
    }
  }, [user?.id]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      dashboardStats, 
      loading,
      fetchDashboardStats,
      updateProgress,
      updateProfile,
      fetchUserCourses,
      fetchUserExams
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
