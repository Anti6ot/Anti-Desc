const express = require("express");
const cors = require("cors");
const { sql, poolConnect } = require("./db/config/dbConfig");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken"); // Импорт библиотеки
const secretKey = "yourSecretKey";
const { checkRole } = require("./middleware/middleware.js");
const os = require("os");
app.use(cors());
app.use(express.json());

// Хеширование пароля
const hashPassword = async (password) => {
  const saltRounds = 10; // Уровень сложности хеширования
  return await bcrypt.hash(password, saltRounds);
};

// Проверка пароля
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// auth
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // const clientIp =
  // req.headers["x-forwarded-for"] || // Если за прокси
  // req.connection.remoteAddress || // IPv6 или локальные
  // req.socket.remoteAddress ||
  // (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // const hostname = os.hostname();
  // console.log(hostname)
  // console.log("IP-адрес клиента:",  clientIp);

  try {
    const pool = await poolConnect; // Убедиться, что подключение к базе выполнено
    const request = pool.request();
    request.input("Email", sql.NVarChar, email);

    const result = await request.query(`
      SELECT * FROM Users WHERE Email = @Email;
    `);

    const user = result.recordset[0];

    if (
      user &&
      bcrypt.compareSync(password, user.PasswordHash) &&
      user.IsActive
    ) {
      // Генерация токена с ролью
      const token = jwt.sign(
        { userId: user.UserID, role: user.Role },
        secretKey,
        { expiresIn: "1h" }
      );

      // Возвращаем токен клиенту
      res.json({
        token,
        user: {
          id: user.UserID,
          email: user.Email,
          role: user.Role,
          name: user.Username,
          fio: user.FIO,
          tel: user.tel,
          jobTitle: user.jobTitle,
          cabinet: user.cabinet,
          adress: user.Adress,
          isActive: user.IsActive,
          SLA: user.SLA,
        },
      });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/addUser", async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    filial,
    FIO,
    tel,
    cabinet,
    jobTitle,
  } = req.body;

  try {
    const pool = await poolConnect; // Убедиться, что подключение к базе выполнено
    const hashedPassword = await hashPassword(password); // Хешируем пароль
    const result = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .input("Email", sql.NVarChar, email)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .input("Role", sql.NVarChar, role)
      .input("Adress", sql.NVarChar, filial)
      .input("FIO", sql.NVarChar, FIO)
      .input("tel", sql.NVarChar, tel)
      .input("cabinet", sql.Int, cabinet)
      .input("jobTitle", sql.NVarChar, jobTitle).query(`
          INSERT INTO Users (Username, Email, PasswordHash, Role, Adress, FIO, tel, cabinet, jobTitle)
          VALUES (@Username, @Email, @PasswordHash, @Role, @Adress, @FIO, @tel, @cabinet, @jobTitle);
        `);
    res.status(201).json(result.recordset[0]);
    console.log("User added:", result);
  } catch (err) {
    console.error("Error adding user:", err);
  }
});
app.post(
  "/ticket",
  checkRole(["Admin", "ExternalService", "User", "CartridgeService"]),
  async (req, res) => {
    try {
      const { title, description, workerService, status, createUser, line } =
        req.body;
      const userId = req.user.userId; // Берем ID пользователя из токена
      const pool = await poolConnect; // Убедиться, что подключение к базе выполнено

      // Создаем запрос
      const request = pool.request();
      request.input("Title", sql.NVarChar, title);
      request.input("Description", sql.NVarChar, description);
      request.input("Status", sql.NVarChar, status);
      request.input("workerService", sql.NVarChar, workerService);
      request.input("CreatedBy", sql.Int, userId);
      request.input("CreatedUser", sql.NVarChar, createUser);
      request.input("line", sql.NVarChar, line);

      // // Выполняем SQL-запрос
      const result = await request.query(`
        INSERT INTO Tickets (Title, Description, CreatedBy, CreatedUser, Status, workerService, line)
        OUTPUT INSERTED.TicketID, INSERTED.Title, INSERTED.Description, INSERTED.Status, INSERTED.CreatedAt, INSERTED.CreatedBy, INSERTED.CreatedUser,INSERTED.workerService, INSERTED.line
        VALUES (@Title, @Description, @CreatedBy, @CreatedUser, @Status, @workerService, @line)
      `);
      res.status(201).json(result.recordset[0]);
    } catch (err) {
      console.error("Error inserting ticket:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
app.get(
  "/tickets",
  checkRole(["Admin", "ExternalService", "User", "CartridgeService"]),
  async (req, res) => {
    try {
      const pool = await poolConnect;
      const request = pool.request();
      const result = await request.query(
        "SELECT * FROM Tickets ORDER BY CreatedAt DESC"
      );

      res.json(result.recordset);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
app.get(
  "/mytickets",
  checkRole(["Admin", "ExternalService", "User", "CartridgeService"]),
  async (req, res) => {
    const { userId } = req.user;
    const { workerService } = req.query;
    const { Status } = req.query;

    try {
      const pool = await poolConnect;
      const request = pool.request();

      if (workerService) {
        // Если указан workerService, фильтруем по нему
        request.input("WorkerService", sql.NVarChar, workerService);
        const result = await request.query(
          "SELECT * FROM Tickets WHERE workerService = @WorkerService;"
        );
        res.json(result.recordset);
      } else if (Status) {
        request.input("Status", sql.NVarChar, Status);
        const result = await request.query(
          "SELECT * FROM Tickets WHERE Status = @Status;"
        );
        res.json(result.recordset);
      } else {
        request.input("CreatedBy", sql.Int, userId);
        const result = await request.query(
          "SELECT * FROM Tickets WHERE CreatedBy = @CreatedBy;"
        );
        res.json(result.recordset);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.get(
  "/userInfo",
  checkRole(["Admin", "ExternalService", "User", "CartridgeService"]),
  async (req, res) => {
    try {
      const { userId } = req.query; // Получаем userId из query строки
      const pool = await poolConnect;
      const request = pool.request();
      request.input("CreatedBy", sql.Int, userId);
      const result = await request.query(`
        SELECT Adress, UserName, CreatedAt, Email, FIO, tel, jobTitle, cabinet
        FROM Users
        WHERE UserID = @CreatedBy;
      `);

      if (result.recordset.length === 0) {
        return res.status(404).send("Пользователь не найден");
      }

      res.json(result.recordset[0]); // Отправляем информацию о пользователе
    } catch (err) {
      console.error("Error fetching user info:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
// comments
app.get(
  "/comments/:id",
  checkRole(["Admin", "ExternalService", "User", "CartridgeService"]),
  async (req, res) => {
    try {
      const { id: ticketId } = req.params; // Получаем ID тикета из параметров

      if (!ticketId) {
        return res.status(400).send("TicketID is required");
      }

  
      const pool = await poolConnect; // Убедимся, что есть подключение к БД
      const request = pool.request();

      // Передаем параметр в запрос
      request.input("TicketID", sql.Int, ticketId);

      // Запрос для получения комментариев по TicketID
      const result = await request.query(`
        SELECT * FROM Comments
        WHERE TicketID = @TicketID
        ORDER BY CreatedAt DESC
      `);

      // Если комментариев нет
      if (result.recordset.length === 0) {
        return res.status(404).send("Комментарии не найдены");
      }

      // Возвращаем все комментарии к указанному тикету
      res.json(result.recordset);
    } catch (err) {
      console.error("Error fetching comments:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
app.post(
  "/comments",
  checkRole(["Admin", "ExternalService", "User", "CartridgeService"]),
  async (req, res) => {
    try {
      const { ticketId, content, author } = req.body;
      const pool = await poolConnect; // Убедиться, что подключение к базе выполнено
      const request = pool.request();

      if (!ticketId || !content || !author) {
        return res.status(400).send("Все поля обязательны для заполнения.");
      }

      if (!ticketId) {
        return res.status(400).send("TicketID is required");
      }

      request.input("TicketID", sql.Int, ticketId);
      request.input("Author", sql.NVarChar, author);
      request.input("Content", sql.NVarChar, content);

      // Выполняем SQL-запрос
      const result = await request.query(`
        INSERT INTO Comments (TicketID, Author, Content)
        OUTPUT INSERTED.CommentID, INSERTED.TicketID, INSERTED.Author, INSERTED.Content
        VALUES (@TicketID, @Author, @Content)
      `);

      res.status(201).json(result.recordset[0]);
    } catch (err) {
      console.error("Error inserting comments:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
app.patch(
  "/tickets/:id",
  checkRole(["Admin", "ExternalService", "CartridgeService", "User"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        status,
        title,
        description,
        workerService,
        lastRedact,
        line,
        priority,
      } = req.body;
      if (!status) {
        return res.status(400).send("Status is required");
      }
      const pool = await poolConnect;
      // Создаем запрос на основе соединения из пула
      const request = pool.request();
      request.input("TicketID", sql.Int, id);
      request.input("Description", sql.NVarChar, description);
      request.input("Title", sql.NVarChar, title);
      request.input("workerService", sql.NVarChar, workerService);
      request.input("Status", sql.NVarChar, status);
      request.input("LastRedact", sql.Int, lastRedact);
      request.input("line", sql.NVarChar, line);
      request.input("priority", sql.NVarChar, priority);

      // Выполняем SQL-запрос для обновления и выборки данных
      const result = await request.query(`
      UPDATE Tickets
      SET Status = @Status,
       Description = @Description,
       workerService = @workerService,
       Title = @Title,
       LastRedact = @LastRedact,
       line = @line,
       Priority = @priority

      WHERE TicketID = @TicketID;
      SELECT * FROM Tickets WHERE TicketID = @TicketID;
    `);

      if (result.recordset.length === 0) {
        res.status(404).send("Ticket not found");
      } else {
        res.json(result.recordset[0]);
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.delete("/tickets/:id", checkRole(["Admin"]), async (req, res) => {
  try {
    const { id } = req.params; // Получаем ID тикета из URL
    const pool = await poolConnect; // Убеждаемся, что подключение установлено
    const request = pool.request();
    request.input("TicketID", sql.Int, id);

    const result = await request.query(`
        DELETE FROM Tickets
        WHERE TicketID = @TicketID;
      `);

    // Если удалено 0 строк, значит тикет с таким ID не найден
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Ticket not found");
    }

    res.status(200).send("Ticket deleted successfully");
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
