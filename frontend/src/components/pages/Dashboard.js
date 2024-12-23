import React, { useContext, useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import axios from "axios";
import DashboardSubItem from "./subPages/DashboardSubItem";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getSLAinfo } from "../../services/service.databases";
import getRowClassName from "../../utils/getRowClassName";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const { token, user } = useContext(AuthContext); // Получаем токен из контекста
  const navigate = useNavigate();

  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (token) {
      // Создаем асинхронную функцию внутри useEffect
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/mytickets", {
            headers: {
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
            },
            params: { Status: "Зарегестрированна" },
          });
          const filteredTickets = response.data.filter(
            (ticket) => ticket.LastRedact === null
          );
          // // Получаем SLA информацию для всех CreatedBy
          // const slaInfoPromises = filteredTickets.map((ticket) =>
          //   getSLAinfo(ticket.CreatedBy, token)
          // );
          // const slaInfo = await Promise.all(slaInfoPromises);
          // const ticketsWithSLA = filteredTickets.map((ticket, index) => ({
          //   ...ticket,
          //   SLA: slaInfo[index]?.SLA || null, // Добавляем SLA к каждой задаче
          // }));
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

  return (
    <>
      <NavBar />
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
                  <td>{task.CreatedUser}</td>
                </tr>
                {expandedRow === task.TicketID && (
                  <tr>
                    <td colSpan="5" className="bg-light">
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
