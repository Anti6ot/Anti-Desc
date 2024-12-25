import React, { useState } from "react";

export default function SearchOnNav({ onSearch }) {
  // Состояние для хранения строки поиска
  const [searchTerm, setSearchTerm] = useState("");

  // Обработчик изменения строки поиска
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Обновляем строку поиска
  };

  // Обработчик отправки поиска
  const handleSearchSubmit = () => {
    onSearch(searchTerm); // Вызываем переданный колбэк для поиска
  };

  return (
    <form className="d-flex input-group w-auto">
      <input
        type="search"
        className="form-control"
        onChange={handleSearchChange}
        placeholder="название заявки"
        aria-label="Search"
      />
      <button
        className="btn btn-outline-info"
        type="button"
        onClick={handleSearchSubmit}
        data-mdb-ripple-color="dark"
      >
        Поиск
      </button>
    </form>
  );
}
