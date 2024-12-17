import React, { useContext, useState } from "react";
import { redactTaskDB } from "../../../services/service.databases";
import { AuthContext } from "../../../context/AuthContext";

export default function DashboardSubItem({ data }) {
  const [task, setTask] = useState(data);
  const { token } = useContext(AuthContext); 

  // Обработчик изменения статуса задачи
  const handleStatusChange = (e) => {
    const newData = e.target.value;
    // Обновляем статус задачи
    setTask((prev) => ({
      ...prev,
      Status: newData,
    }));
  };
  // Обработчик изменения выбора сервиса
  const handleServiceChange = (e) => {
    const newData = e.target.value;
    // Обновляем статус задачи
    setTask((prev) => ({
      ...prev,
      workerService: newData,
    }));
  };

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
    redactTaskDB(task, token);
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
        <div className="m-2 form-floating">
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            value={task.Status}
            onChange={handleStatusChange}>
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
            value={task.workerService}
            onChange={handleServiceChange}>
            <option value="Сервис itMix">Сервис itMix</option>
            <option value="User">
              Сервис по обслуживаню картриджей
            </option>
            <option value="ExternalService">внешний Сервис</option>
          </select>
          <label htmlFor="floatingSelect">Выберете исполнителя</label>
        </div>

        <button
          className="btn mt-3 btn-primary w-100"
          type="submit"
          onClick={handleSaveOndb}>
          Изменить
        </button>
      </div>
    </>
  );
}
