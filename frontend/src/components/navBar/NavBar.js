import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function NavBar() {
  const { logout, user } = useContext(AuthContext);
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Главная
              </Link>
            </li>
            {user.role === "User" || user.role === "ExternalService" || user.role === "CartridgeService"  ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/outgoingtickets">
                    Исходящие
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/mytickets">
                    Входящие
                  </Link>
                </li>
              </>
            ) : (
              <>
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
        </div>
      </nav>
    </div>
  );
}
