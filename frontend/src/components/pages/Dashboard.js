import React, { useContext, useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import axios from "axios";
import DashboardSubItem from "./subPages/DashboardSubItem";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const { token } = useContext(AuthContext); // Получаем токен из контекста
  const navigate = useNavigate();

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };
    // Создаем асинхронную функцию внутри useEffect
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tickets", {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
          },
        });
        setTickets(response.data); // Обновляем состояние после получения данных
      } catch (error) {
        console.error("Error fetching tickets:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login"); // Перенаправляем на страницу логина, если ошибка 401
      }
      }
    };

  useEffect(() => {
    if (token) {
      fetchData(); // Загружаем билеты, если есть токен
    } else {
      navigate("/login"); // Если нет токена, перенаправляем на страницу логина
    }
  }, [token, navigate]);
 
  return (
    <>
      <NavBar />

      <div className="container mt-5 ">
        <table className="table table-bordered border-tertiary">
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Название Заявки</th>
              <th scope="col">Описание</th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody className="accordion" id="accordionFlushExample">
            {tickets.map((task) => (
              <React.Fragment key={task.TicketID}>
                <tr
                  className="accordion-item"
                  key={task.TicketID}
                  onClick={() => toggleRow(task.TicketID)}>
                  <th scope="row">{task.TicketID}</th>
                  <td>{task.Title}</td>
                  <td>{task.Description}</td>
                  <td>{task.Status}</td>
                </tr>
                {expandedRow === task.TicketID && (
                  <tr>
                    <td colSpan="5" className="bg-light">
                      <DashboardSubItem data={task}/>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
