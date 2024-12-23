const api_url = process.env.REACT_APP_API_URL;

export async function createTaskDB(
  { Description, Title, Status, line, workerService },
  token,
  user
) {
  try {
    // Отправляем запрос на сервер
    const response = await fetch(`${api_url}/ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      },
      body: JSON.stringify({
        title: Title ? Title : "undefined",
        description: Description ? Description : "undefined",
        status: Status ? Status : "Зарегестрированна",
        workerService: workerService ? workerService : "itMix",
        line: line ? line : "-",
        createUser: user.name,
      }),
    });

    // Обрабатываем ответ сервера
    if (response.ok) {
      const updatedTask = await response.json();
      console.log("Задача успешно Добавленна:", updatedTask);
    } else {
      const errorMessage = await response.text();
      console.error("Ошибка при добавлении задачи:", errorMessage);
    }
  } catch (err) {
    console.error("Ошибка сети:", err);
  }
}

export async function redactTaskDB(
  { TicketID, Status, Description, Title, workerService, line, Priority },
  token,
  user
) {
  const userId = user.id;
  try {
    // Отправляем запрос на сервер
    const response = await fetch(`${api_url}/tickets/${TicketID}`, {
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
        line: line,
        lastRedact: userId,
        priority: Priority,
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
    const response = await fetch(`${api_url}/tickets/${TicketID}`, {
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
export async function createUserOnDB(
  { username, filial, email, password, role, FIO, tel, cabinet, jobTitle },
  token
) {
  try {
    // Отправляем запрос на сервер
    const response = await fetch(`${api_url}/addUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        role: role,
        filial: filial,
        tel: tel,
        FIO: FIO,
        cabinet: cabinet,
        jobTitle: jobTitle,
      }),
    });

    // Обрабатываем ответ сервера
    if (response.ok) {
      const createdUser = await response.json();
      console.log("Пользователь успешно добавлен:", createdUser);
    } else {
      const errorMessage = await response.text();
      console.error("Ошибка при обновлении задачи:", errorMessage);
    }
  } catch (err) {
    console.error("Ошибка сети:", err);
  }
}

export async function getUserInfo(userId, token) {
  try {
    // Отправляем запрос на сервер
    const response = await fetch(`${api_url}/userInfo?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });
    // Обрабатываем ответ сервера
    if (response.ok) {
      const gotUserInfo = await response.json();
      return gotUserInfo;
    } else {
      const errorMessage = await response.text();
      console.error("Ошибка при получении данных:", errorMessage);
    }
  } catch (err) {
    console.error("Ошибка сети:", err);
  }
}

export async function createCommentDB(ticketId, newComment, token, user) {
  try {
    const response = await fetch(`${api_url}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      },
      body: JSON.stringify({
        ticketId,
        content: newComment,
        author: user.fio,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    return await response.json(); // Возвращаем данные о созданном комментарии
  } catch (err) {
    console.error("Error adding comment:", err);
    throw err;
  }
}

export async function getComments(ticketId, token) {
  try {
    const response = await fetch(`${api_url}/comments/${ticketId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.status === 404) {
      return [];
    }

    const gotComments = await response.json();
    return gotComments;
  } catch (err) {
    console.error("Error fetching comments:", err);
    return err
  }
}
// export async function getSLAinfo(CreatedBy, token) {
//   try {
//     // Отправляем запрос на сервер
//     const response = await fetch(`${api_url}/slainfo/${CreatedBy}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
//       },
//     });
//     // Обрабатываем ответ сервера
//     if (response.ok) {
//       const gotCreatedByInfo = await response.json();
//       return gotCreatedByInfo;
//     } else {
//       const errorMessage = await response.text();
//       console.error("Ошибка при получении данных:", errorMessage);
//     }
//   } catch (err) {
//     console.error("Ошибка сети:", err);
//   }
// }
