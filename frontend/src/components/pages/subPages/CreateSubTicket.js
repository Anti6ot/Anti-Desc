import React, { useContext, useState } from "react";
import { createTaskDB } from "../../../services/service.databases";
import { AuthContext } from "../../../context/AuthContext";

export default function CreateSubTicket({ handleCloseModal }) {
  const [task, setTask] = useState([]);
  const { token, user } = useContext(AuthContext);

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
    createTaskDB(task, token, user);
    console.log("Отправляем данные:", task, user);
  };
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="createSubTicketModalLabel"
        aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createSubTicketModalLabel">
                Создать заявку
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Название заявки
              </label>
              <input
                type="text"
                className="form-control"
                name="Title" // Поле для названия
                id="exampleFormControlInput1"
                onChange={handleInputChange}
              />
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                Описание
              </label>
              <textarea
                className="form-control"
                name="Description" // Поле для описания
                value={task.Description} // Связь с состоянием
                onChange={handleInputChange} // Обновление состояния
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}>
                Закрыть
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSaveOndb}>
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
