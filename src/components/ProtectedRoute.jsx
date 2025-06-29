import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung con
  return children;
};

export default ProtectedRoute;