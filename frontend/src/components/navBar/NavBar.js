import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CreateSubTicket from "../pages/subPages/CreateSubTicket";
import AddNewUser from "../pages/subPages/AddNewUser";

export default function NavBar() {
  const { logout, user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showModalUser, setshowModalUser] = useState(false);

  // Открытие и закрытие модального окна
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  // Открытие и закрытие модального окна
  const handleOpenModalUser = () => setshowModalUser(true);
  const handleCloseModalUser = () => setshowModalUser(false);
  return (
    <>
      <nav
        className="navbar navbar-expand-lg fixed-top navbar-light bg-light"
        style={{ "--navbar-height": "80px" }}>
        <div className="container-fluid">
          <span className="navbar-brand">
            <img
              src="https://github.com/Anti6ot/Logo/blob/main/antidesclogo.png?raw=true"
              alt=""
              loading="lazy"
              style={{
                height: "50px", // высота картинки
                width: "150px", // ширина картинки
                objectFit: "cover", // обрезать картинку, сохраняя пропорции
              }}
            />
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Главная
                </Link>
              </li>
              {user.role === "User" ||
              user.role === "ExternalService" ||
              user.role === "CartridgeService" ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/outgoingtickets">
                      Исходящие
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/ingoingticket">
                      Входящие
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Нераспределенные
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/ingoingticket">
                      Входящие
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/outgoingtickets">
                      Исходящие
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <Link className="nav-link" onClick={logout} to="/">
                  Выйти
                </Link>
              </li>
            </ul>
            <div>
              {user.role === "Admin" ? (
                <div>
                  <button
                    className="btn btn-outline-secondary  me-3"
                    type="button"
                    onClick={handleOpenModalUser}>
                    Добавить пользователя
                  </button>
                  {showModalUser && (
                    <AddNewUser handleCloseModalUser={handleCloseModalUser} />
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {/* Кнопка для открытия модального окна */}
              <button
                className="btn btn-outline-success me-3"
                type="button"
                onClick={handleOpenModal}>
                Создать
              </button>
              {showModal && (
                <CreateSubTicket handleCloseModal={handleCloseModal} />
              )}
            </div>

            <form className="d-flex input-group w-auto">
              <input
                type="search"
                className="form-control"
                placeholder="название заявки"
                aria-label="Search"
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                data-mdb-ripple-color="dark">
                Поиск
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}
