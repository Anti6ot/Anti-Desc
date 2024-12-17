// models/user.js
const { poolPromise } = require('../db/config/dbConfig'); // подключение к базе

class User {
  static async findByUsername(username) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @Username');
    
    return result.recordset[0]; // Возвращаем первого пользователя, если найден
  }

  static async create(username, passwordHash, roleId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Username', sql.NVarChar, username)
      .input('PasswordHash', sql.NVarChar, passwordHash)
      .input('RoleId', sql.Int, roleId)
      .query('INSERT INTO Users (Username, PasswordHash, RoleId) VALUES (@Username, @PasswordHash, @RoleId)');
    
    return result.rowsAffected[0] > 0; // Возвращаем true, если пользователь был создан
  }

  
}

module.exports = User;
