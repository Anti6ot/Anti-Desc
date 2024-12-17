const jwt = require('jsonwebtoken');
const secretKey = "yourSecretKey"; // Используйте ваш секретный ключ для подписи токенов

const checkRole = (requiredRoles) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("No token provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Сохраняем декодированные данные в запрос

    // Проверяем, есть ли у пользователя нужная роль
    if (!requiredRoles.includes(decoded.role)) {
      return res.status(403).send("Access denied");
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("Invalid token");
  }
};

module.exports = { checkRole };
