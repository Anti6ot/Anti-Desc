import React, { useContext, useState } from "react";
import { createUserOnDB } from "../../../services/service.databases";
import { AuthContext } from "../../../context/AuthContext";

export default function AddNewUser({ handleCloseModalUser }) {
  const [userAcc, setUser] = useState({
    FIO: "",
    cabinet: "",
    email: "",
    filial: "",
    jobTitle: "",
    password: "",
    role: "User", 
    tel: "",
    username: ""
  });
  const { token } = useContext(AuthContext);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCreateUserOndb = (e) => {
    e.preventDefault();
    createUserOnDB(userAcc, token);
    console.log("Отправляем данные:", userAcc);
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
                Новый пользователь
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModalUser}
                aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Организация
              </label>
              <input
                type="text"
                className="form-control"
                name="username" // Поле для названия
                id="exampleFormControlInput1"
                onChange={handleInputChange}
              />
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label"
                id="exampleFormControlInput1">
                Филиал
              </label>
              <input
                className="form-control"
                name="filial" // Поле для описания
                onChange={handleInputChange} // Обновление состояния
              ></input>
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                почта
              </label>
              <input
                className="form-control"
                type="text"
                name="email" // Поле для описания
                onChange={handleInputChange} // Обновление состояния
              ></input>
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                пароль
              </label>
              <input
                className="form-control"
                type="password"
                name="password" // Поле для описания
                onChange={handleInputChange} // Обновление состояния
              ></input>
              <label
                type="text"
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                ФИО
              </label>
              <input
                className="form-control"
                type="text"
                name="FIO" // Поле для описания
                onChange={handleInputChange} // Обновление состояния
              ></input>
              <label
                type="text"
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                Телефон
              </label>
              <input
                className="form-control"
                type="text"
                name="tel" // Поле для описания
                onChange={handleInputChange} // Обновление состояния
              ></input>
              <label
                type="text"
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                Должность
              </label>
              <input
                className="form-control"
                type="text"
                name="jobTitle" // Поле для описания
                onChange={handleInputChange} // Обновление состояния
              ></input>
              <label
                type="text"
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                Роль
              </label>
              <select
                className="form-select"
                id="floatingSelect"
                aria-label="Выбор роли"
                name="role"
                value={userAcc.role}
                onChange={handleInputChange}>
                <option value="Admin">Админ</option>
                <option value="ExternalService">Внешний сервис</option>
                <option value="CartridgeService">Внутренний сервис</option>
                <option value="User">Абонент</option>
              </select>
              <label
                type="text"
                htmlFor="exampleFormControlTextarea1"
                className="form-label">
                Кабинет
              </label>
              <input
                className="form-control"
                type="number"
                name="cabinet" // Поле для описания
                onChange={handleInputChange} // Обновление состояния
              ></input>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModalUser}>
                Закрыть
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateUserOndb}>
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
