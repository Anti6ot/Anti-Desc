import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("authToken");
    return storedToken && typeof storedToken === "string" ? storedToken : null;
  });
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  ); // Хранение данных пользователя, включая роль

  const login = (newToken, userData) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("authToken", newToken); // Сохраняем токен в localStorage
    }
    if (userData) {
      setUser(userData); // Сохраняем данные пользователя в состоянии
      localStorage.setItem("user", JSON.stringify(userData)); // Сохраняем данные пользователя в localStorage
      localStorage.setItem("role", JSON.stringify(userData.role? userData.role : 'non a have user role')); // Сохраняем данные пользователя в localStorage

    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

  };

  const isAuthenticated = !!token;

  // Проверка токена при обновлении страницы
  useEffect(() => {
    if (!token || !user) {
      logout(); // Логаут, если данных нет или токен недействителен
    }
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
