import React, { useContext, useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import axios from "axios";
import DashboardSubItem from "./subPages/DashboardSubItem";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import getRowClassName from "../../utils/getRowClassName";
import formatDate from "../../utils/formatDate";
// import updRenderTickets from "../../utils/updRenderTickets";

const api_url = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const { token } = useContext(AuthContext); // Получаем токен из контекста
  const navigate = useNavigate();
 
  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (token) {
      // Создаем асинхронную функцию внутри useEffect
      const fetchData = async () => {
        try {
          const response = await axios.get(`${api_url}/mytickets`, {
            headers: {
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
            },
            params: { Status: "Зарегестрированна" },
          });
          const filteredTickets = response.data.filter(
            (ticket) => ticket.LastRedact === null
          );
          setTickets(filteredTickets); // Сохраняем задачи с SLA
        } catch (error) {
          console.error("Error fetching tickets:", error);
          if (error.response && error.response.status === 401) {
            navigate("/login"); // Перенаправляем на страницу логина, если ошибка 401
          }
        }
      }; // Загружаем задачи, если есть токен
      fetchData();
    } else {
      navigate("/login"); // Если нет токена, перенаправляем на страницу логина
    }
  }, [token, navigate]);

  console.log(tickets)
  return (
    <>
      <NavBar tckts={tickets}/>

      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ marginTop: "120px" }}>
        <table className="table table-bordered border-tertiary">
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Название Заявки</th>
              <th scope="col">Описание</th>
              <th scope="col">Статус</th>
              <th scope="col">Дата регистрации</th>
              <th scope="col">Регистратор</th>
            </tr>
          </thead>
          <tbody className="accordion" id="accordionFlushExample">
            {tickets.map((task) => (
              <React.Fragment key={task.TicketID}>
                <tr
                  className={`${getRowClassName(task.Priority)}`}
                  key={task.TicketID}
                  onClick={() => toggleRow(task.TicketID)}>
                  <th scope="row">{task.TicketID}</th>
                  <td>{task.Title}</td>
                  <td>{task.Description}</td>
                  <td>{task.Status}</td>
                  <td>{formatDate(task.CreatedAt)}</td>
                  <td>{task.CreatedUser}</td>
                </tr>
                {expandedRow === task.TicketID && (
                  <tr>
                    <td colSpan="6" className="bg-light">
                      <DashboardSubItem data={task} />
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
