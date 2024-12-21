import React, { useContext, useState } from "react";
import NavBar from "../navBar/NavBar";
import { AuthContext } from "../../context/AuthContext";
import add100tickents from "../../utils/add100tickents";

export default function Home() {
  const { user, token } = useContext(AuthContext);

  const transformedObject = {
    Имя: user.name,
    ФИО: user.fio,
    Почта: user.email,
    Должность: user.jobTitle,
    Телефон: user.tel,
    Адрес: user.adress,
  };
  const [userInfo, setUserInfo] = useState(transformedObject);
  console.log(userInfo);
  return (
    <>
      <NavBar />
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ marginTop: "180px" }}>
        <div className="card" style={{ width: "28rem" }}>
          <table className="table table-bordered border-tertiary">
            <tbody className="accordion" id="accordionFlushExample">
              {Object.entries(userInfo).map(([key, userInf]) => (
                <React.Fragment key={key}>
                  <tr colSpan="2" className="bg-light" key={userInf.id}>
                    <td>{key}</td>
                    <td>{userInf}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary mt-3">Изменить</button>
          <button
            className="btn btn-primary mt-3"
            onClick={() => add100tickents(user, token)}>
            Добавить 100 заявок
          </button>
        </div>
      </div>
    </>
  );
}
