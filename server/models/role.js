// models/role.js
const { poolPromise } = require('../db/config/dbConfig'); // подключение к базе

class Role {
  static async findByName(roleName) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('RoleName', sql.NVarChar, roleName)
      .query('SELECT * FROM Roles WHERE Name = @RoleName');
    
    return result.recordset[0]; // Возвращаем первую роль, если найдена
  }

  // Можно добавить другие методы для работы с ролями
}

module.exports = Role;
