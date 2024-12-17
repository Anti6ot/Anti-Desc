import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  // Проверяем, авторизован ли пользователь
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
   // Проверяем, есть ли у пользователя нужная роль
   if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }


  return children;
};

export default ProtectedRoute;
