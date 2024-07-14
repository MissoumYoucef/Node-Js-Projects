const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log('authenticated');
    next();
  });
};
module.exports = authenticateJWT;
