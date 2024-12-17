require("dotenv").config();
const sql = require("mssql");
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: 1433, // Если порт не указан, используем порт по умолчанию
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, // Если сервер без SSL
    trustServerCertificate: true, // Для отключения проверки сертификата
  },
};
const pool = new sql.ConnectionPool(config);

// Создаем promise для подключения
const poolConnect = pool
  .connect()
  .then(() => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => {
    console.error("Connection error:", err);
    throw err;
  });

// Экспортируем необходимые модули
module.exports = { sql, poolConnect };
