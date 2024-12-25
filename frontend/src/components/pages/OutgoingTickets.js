import React, { useContext, useEffect, useState } from "react";
import NavBar from "../navBar/NavBar";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardSubItem from "./subPages/DashboardSubItem";
import useExpandedRow from "../../utils/expandRow";
import BtnSort from "./buttons/BtnSort";
import getRowClassName from "../../utils/getRowClassName";
import formatDate from "../../utils/formatDate";

const api_url = process.env.REACT_APP_API_URL;

export default function OutgoingTickets() {
  const { user, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]); // Состояние для всех заявок (неизменяемое)
  const { expandedRow, toggleRow } = useExpandedRow();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Создаем асинхронную функцию внутри useEffect
      const fetchData = async () => {
        try {
          const response = await axios.get(`${api_url}/mytickets`, {
            headers: {
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
            },
            params: { userId: user.id }, // Передаем userId как параметр запроса
          });
          setTickets(response.data); // Обновляем состояние после получения данных
          setAllTickets(response.data); // Сохраняем все заявки для дальнейшей фильтрации
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
  return (
    <>
      <NavBar tckts={tickets} />

      <div className="container" style={{ marginTop: "120px" }}>
        <BtnSort
          tickets={tickets}
          setTickets={setTickets}
          allTickets={allTickets}
        />
        <div className="container d-flex justify-content-center align-items-center">
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
              {tickets.length !== 0 ? (
                tickets.map((task) => (
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
                    {expandedRow === task.TicketID &&
                      (user.role === "ExternalService" ||
                        user.role === "CartridgeService" ||
                        user.role === "Admin") && (
                        <tr>
                          <td colSpan="6" className="bg-light">
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
      </div>
    </>
  );
}
