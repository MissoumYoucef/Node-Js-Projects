const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  jwt.verify(token.split(' ')[1], secret, (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Token is not valid' });
    req.user = decoded;
    console.log(decoded);
    next();
  });
}

module.exports = authenticateToken;
