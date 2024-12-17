const express = require("express");
const cors = require("cors");
const { sql, poolConnect } = require("./db/config/dbConfig");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken"); // Импорт библиотеки
const secretKey = "yourSecretKey";
const { checkRole } = require("./middleware/middleware.js");
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

  try {
    const pool = await poolConnect; // Убедиться, что подключение к базе выполнено

    const request = pool.request();
    request.input("Email", sql.NVarChar, email);

    const result = await request.query(`
      SELECT * FROM Users WHERE Email = @Email;
    `);

    const user = result.recordset[0];

    if (user && bcrypt.compareSync(password, user.PasswordHash)) {
      // Генерация токена с ролью
      const token = jwt.sign(
        { userId: user.UserID, role: user.Role },
        secretKey,
        { expiresIn: "1h" }
      );

      // Возвращаем токен клиенту
      res.json({
        token,
        user: { id: user.UserID, email: user.Email, role: user.Role },
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
  const { username, email, password, role } = req.body;
  try {
    const pool = await poolConnect; // Убедиться, что подключение к базе выполнено
    const hashedPassword = await hashPassword(password); // Хешируем пароль
    const result = await pool
      .request()
      .input("Username", sql.NVarChar, username)
      .input("Email", sql.NVarChar, email)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .input("Role", sql.NVarChar, role).query(`
          INSERT INTO Users (Username, Email, PasswordHash, Role)
          VALUES (@Username, @Email, @PasswordHash, @Role);
        `);
    res.status(201);
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
      const { title, description } = req.body;
      const userId = req.user.userId; // Берем ID пользователя из токена
      const pool = await poolConnect; // Убедиться, что подключение к базе выполнено

      // Создаем запрос
      const request = pool.request();
      request.input("Title", sql.NVarChar, title);
      request.input("Description", sql.NVarChar, description);
      request.input("CreatedBy", sql.Int, userId);

      // // Выполняем SQL-запрос
      const result = await request.query(`
        INSERT INTO Tickets (Title, Description, CreatedBy)
        OUTPUT INSERTED.TicketID, INSERTED.Title, INSERTED.Description, INSERTED.Status, INSERTED.CreatedAt, INSERTED.CreatedBy
        VALUES (@Title, @Description, @CreatedBy)
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

    try {
      const pool = await poolConnect;
      const request = pool.request();
      request.input("CreatedBy", sql.Int, userId);
      const result = await request.query(
        "SELECT * FROM Tickets WHERE CreatedBy = @CreatedBy;"
      );

      res.json(result.recordset);
    } catch (err) {
      console.error("Error fetching tickets:", err);
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
      const { status, title, description, workerService, lastRedact } = req.body;
      console.log(lastRedact)
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


      // Выполняем SQL-запрос для обновления и выборки данных
      const result = await request.query(`
      UPDATE Tickets
      SET Status = @Status,
       Description = @Description,
       workerService = @workerService,
       Title = @Title,
       LastRedact = @LastRedact
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
