const apiUrl = "http://localhost:5000";

export async function redactTaskDB(
  { TicketID, Status, Description, Title, workerService },
  token, user
) {
  const userId = user.id
  try {
    // Отправляем запрос на сервер
    const response = await fetch(`${apiUrl}/tickets/${TicketID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      },
      body: JSON.stringify({
        title: Title,
        description: Description,
        workerService: workerService,
        status: Status,
        lastRedact: userId
      }),
    });

    // Обрабатываем ответ сервера
    if (response.ok) {
      const updatedTask = await response.json();
      console.log("Задача успешно обновлена:", updatedTask);
    } else {
      const errorMessage = await response.text();
      console.error("Ошибка при обновлении задачи:", errorMessage);
    }
  } catch (err) {
    console.error("Ошибка сети:", err);
  }
}

export async function deleteTaskDB({ TicketID }, token) {
  try {
    // Отправляем запрос на сервер
    const response = await fetch(`${apiUrl}/tickets/${TicketID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Обрабатываем ответ сервера
    if (response.ok) {
      // const updatedTask = await response.json();
      console.log("Задача успешно Удалена:", TicketID);
    } else {
      const errorMessage = await response.text();
      console.error("Ошибка при удалении задачи:", errorMessage);
    }
  } catch (err) {
    console.error("Ошибка сети:", err);
  }
}
