import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getUserInfo } from "../../../services/service.databases";

export default function UserInfo({ dataTask }) {
  const { token } = useContext(AuthContext);
  const CreaterByTask = dataTask.CreatedBy;
  const [userInfo, setUserInfo] = useState({}); // Состояние для хранения данных пользователя
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const UserInfoFromDB = await getUserInfo(CreaterByTask, token); // Получаем данные из базы
        setUserInfo(UserInfoFromDB); // Сохраняем данные в состояние
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
      }
    };

    fetchUserInfo();
  }, [CreaterByTask, token]); // Выполнять запрос, если изменится `CreaterByTask`
  // Рендер, если данные еще загружаются
  if (!userInfo) {
    return <p>Загрузка данных...</p>;
  }
  console.log(userInfo);
  return (
    <>
      <div className="card">
        <div className="card-body">
          <p> <strong>Организация:</strong> {userInfo.UserName}</p>
          <p> <strong>Адрес:</strong> {userInfo.Adress}</p>
          <p><strong>ФИО обращателя:</strong> {userInfo.FIO}</p>
          <p><strong>Должность:</strong> {userInfo.jobTitle}</p>
          <p><strong>эл.Почта:</strong> {userInfo.Email}</p>
          <p><strong>Телефон:</strong> {userInfo.tel}</p>
        </div>
      </div>
    </>
  );
}
