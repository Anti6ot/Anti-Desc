import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CreateSubTicket from "./subPages/CreateSubTicket";
import NavBar from "../navBar/NavBar";

export default function CreateTicket() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  // Создаем асинхронную функцию внутри useEffect
  const fetchPostData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/ticket", {
        headers: {
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
        body: {},
      });
      //   setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login"); // Перенаправляем на страницу логина, если ошибка 401
      }
    }
  };
  return (
    <>
      <NavBar />

      <div>CreateTicket</div>
      <CreateSubTicket />
    </>
  );
}
