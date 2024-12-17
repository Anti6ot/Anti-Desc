import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function NavBar() {
  const { logout } = useContext(AuthContext);
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Главная
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Заявки
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mytickets">
                Входящие
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" onClick={logout} to="/">
                Выйти
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
