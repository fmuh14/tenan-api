const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (token == null) {
    return res.status(401).send({error: 'Unauthorized'});
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle the expired token error
        return res.status(401).send({error: 'Token has expired'});
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({error: 'Token invalid'});
      } else {
        console.log(err);
      }
    } else {
      console.log(decoded);
      next();
    }
  });
};

module.exports = authenticateToken;

