import React from "react";

export default function BtnSort({ tickets, setTickets, allTickets }) {
  const handleBtnChange = (e) => {
    const { value } = e.target;

    // Если выбран пустой статус (Все), отображаем все заявки
    if (value === "") {
      setTickets(allTickets);
    } else {
      // Фильтруем заявки по выбранному статусу
      const filteredTickets = allTickets.filter(
        (ticket) => ticket.Status === value
      );
      setTickets(filteredTickets); // Обновляем состояние с отфильтрованными заявками
    }
  };
  return (
    <div
      className="btn-group d-flex justify-content-end"
      style={{ padding: "10px" }}>
      <>
        <div className="m-2 form-floating">
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Floating label select example"
            // value={task.Status}
            name="Status"
            onChange={handleBtnChange}>
            <option value="">Все статусы</option>
            <option value="Зарегестрированна">Зарегестрированна</option>
            <option value="В работе">В работе</option>
            <option value="Завершена">Завершена</option>
            <option value="Приостановленна">Приостановленна</option>
          </select>
          <label htmlFor="floatingSelect">Филтровать по статусу</label>
        </div>
      </>
    </div>
  );
}
