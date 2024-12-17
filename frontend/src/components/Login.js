import React, { useState, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
  
      // Проверьте, что сервер вернул token и user
      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        console.log("login.js", token, user)
        login(token, user); // Передаем токен и данные пользователя в контекст
        navigate("/dashboard"); // Перенаправление на страницу Dashboard
      } else {
        console.error("Invalid response structure:", response.data);
        alert("Ошибка авторизации. Неверные данные.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Ошибка авторизации. Попробуйте снова.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <form onSubmit={handleSubmit}>
            <h2  className="mb-3" >Войти</h2>
            <input
               className="form-control mb-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
               className="form-control mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary w-100" type="submit">Login</button>
          </form>
        </div>
  );
};

export default Login;
