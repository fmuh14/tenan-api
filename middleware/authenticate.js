const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (token == null) {
    return res.status(401).send({
      code: '401',
      status: 'Unauthorized',
      errors: {
        message: 'No token provided',
      },
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle the expired token error
        return res.status(401).send({
          code: '401',
          status: 'Unauthorized',
          errors: {
            message: 'Token expired',
          },
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({
          code: '401',
          status: 'Unauthorized',
          errors: {
            message: 'Token invalid',
          },
        });
      }

      console.log(err);
      return res.status(401).send({
        code: '401',
        status: 'Unauthorized',
        errors: {
          message: 'Unknown Error',
        },
      });
    }

    console.log(decoded);
    next();
  });
};

module.exports = authenticateToken;

