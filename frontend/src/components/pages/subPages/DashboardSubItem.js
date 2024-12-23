import React, { useContext, useState } from "react";
import {
  deleteTaskDB,
  redactTaskDB,
} from "../../../services/service.databases";
import { AuthContext } from "../../../context/AuthContext";
import UserInfo from "./UserInfo";
import Comments from "../../comments/Comments";

export default function DashboardSubItem({ data }) {
  const [task, setTask] = useState(data);
  const { token, user } = useContext(AuthContext);

  const [expandedRow, setExpandedRow] = useState(null);
  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };
  // // Обработчик изменения статуса задачи
  // const handleStatusChange = (e) => {
  //   const newData = e.target.value;
  //   // Обновляем статус задачи
  //   setTask((prev) => ({
  //     ...prev,
  //     Status: newData,
  //   }));
  // };
  // // Обработчик изменения выбора сервиса
  // const handleServiceChange = (e) => {
  //   const newData = e.target.value;
  //   // Обновляем статус задачи
  //   setTask((prev) => ({
  //     ...prev,
  //     workerService: newData,
  //   }));
  // };

  // Обработчик изменения полей ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Обновляем соответствующее поле задачи
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSaveOndb = (e) => {
    e.preventDefault();
    redactTaskDB(task, token, user);
    console.log("Отправляем данные:", task);
  };
  const handleDelTickOndb = (e) => {
    e.preventDefault();
    deleteTaskDB(task, token);
    console.log("Отправляем данные:", task);
  };
  return (
    <>
      <div className="p-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Название заявки
        </label>
        <input
          type="text"
          className="form-control"
          name="Title" // Поле для названия
          value={task.Title} // Связь с состоянием
          id="exampleFormControlInput1"
          onChange={handleInputChange}
        />
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Описание
        </label>
        <textarea
          className="form-control"
          name="Description" // Поле для описания
          value={task.Description} // Связь с состоянием
          onChange={handleInputChange} // Обновление состояния
        ></textarea>
        <div className="card m-2" onClick={() => toggleRow(task.TicketID)}>
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne">
              Информация о Абоненте
            </button>
          </h2>
          {expandedRow === task.TicketID && <UserInfo dataTask={task} />}
        </div>
        <div className="m-2 form-floating">
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            value={task.Status}
            name="Status"
            onChange={handleInputChange}>
            <option value="Зарегестрированна">Зарегестрированна</option>
            <option value="В работе">В работе</option>
            <option value="Завершена">Завершена</option>
            <option value="Приостановленна">Приостановленна</option>
          </select>
          <label htmlFor="floatingSelect">Выберете статус</label>
        </div>
        <div className="m-2 form-floating">
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            name="workerService"
            value={task.workerService}
            onChange={handleInputChange}>
            <option value="itMix">Сервис itMix</option>
            <option value="CartridgeService">
              Сервис по обслуживаню картриджей
            </option>
            <option value="ExternalService">внешний Сервис</option>
          </select>
          <label htmlFor="floatingSelect">Выберете исполнителя</label>
        </div>
        <div className="m-2 form-floating">
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            value={task.line}
            name="line"
            onChange={handleInputChange}>
            <option value="-" disabled>
              -
            </option>
            <option value="lineOne">Первая линия</option>
            <option value="lineTwo">Вторая линия</option>
          </select>
          <label htmlFor="floatingSelect">Выберете линию</label>
        </div>
        <div className="m-2 form-floating">
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            value={task.Priority}
            name="Priority"
            onChange={handleInputChange}>
            <option value="-" disabled>
              -
            </option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
          <label htmlFor="floatingSelect">Выберете приоритет</label>
        </div>
        <Comments ticketId={task.TicketID} token={token} />
        <button
          className="btn mt-1 btn-primary w-50"
          type="submit"
          onClick={handleSaveOndb}>
          Изменить
        </button>
        {user.role === "Admin" ? (
          <button
            className="btn mt-1 btn-danger w-50"
            type="submit"
            onClick={handleDelTickOndb}>
            Удалить
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
