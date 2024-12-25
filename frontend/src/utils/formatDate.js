export default function formatDate(dateString) {
  const date = new Date(dateString);

  // Получаем день, месяц, год, часы и минуты
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Форматируем дату
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Пример использования:
const formattedDate = formatDate("2024-12-25T11:18:01.327Z");
console.log(formattedDate)