import React, { useContext, useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import { AuthContext } from "../../context/AuthContext";
import useExpandedRow from "../../utils/expandRow";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardSubItem from "./subPages/DashboardSubItem";

export default function IngoingTicket() {
  const [tickets, setTickets] = useState([]);
  const { user, token } = useContext(AuthContext);
  const { expandedRow, toggleRow } = useExpandedRow();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      // Создаем асинхронную функцию внутри useEffect
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/mytickets", {
            headers: {
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
            },
            params: { workerService: user.name }, // Передаем userId как параметр запроса
          })
          const filteredTickets = response.data.filter(ticket => ticket.Status !== "Зарегестрированна");
          setTickets(filteredTickets); // Обновляем состояние после получения данных
        } catch (error) {
          console.error("Error fetching tickets:", error);
          if (error.response && error.response.status === 401) {
            navigate("/login"); // Перенаправляем на страницу логина, если ошибка 401
          }
        }
      };
      fetchData();
    } else {
      navigate("/login"); // Если нет токена, перенаправляем на страницу логина
    }
  }, [token, navigate]);
  console.log(tickets);

  return (
    <>
      <NavBar />
      <div>IngoingTicket</div>
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
              <th scope="col">Создатель обращения</th>
            </tr>
          </thead>
          <tbody className="accordion" id="accordionFlushExample">
            {tickets.length !== 0  ? (
              tickets.map((task) => (
                <React.Fragment key={task.TicketID}>
                  <tr
                    className="accordion-item"
                    key={task.TicketID}
                    onClick={() => toggleRow(task.TicketID)}>
                    <th scope="row">{task.TicketID}</th>
                    <td>{task.Title}</td>
                    <td>{task.Description}</td>
                    <td>{task.Status}</td>
                    <td>{task.CreatedUser}</td>
                  </tr>
                  {expandedRow === task.TicketID &&
                    (user.role === "ExternalService" ||
                      user.role === "CartridgeService" ||
                      user.role === "Admin") && (
                      <tr>
                        <td colSpan="5" className="bg-light">
                          <DashboardSubItem data={task} />
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <th scope="row">"Нет заявок ..."</th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
