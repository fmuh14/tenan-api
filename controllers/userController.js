const jwt = require('jsonwebtoken');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const {knex} = require('../configs/data-source.js');
const {
  validateEmail,
  validatePassword,
} = require('../utils/validation.js');

const register = async (req, res) => {
  const {name, email, password} = req.body;
  // Check all attribute
  if (!name || !email || !password) {
    return res.status(400).send({
      code: '400',
      status: 'Bad Request',
      errors: {
        message: 'Missing attribute',
      },
    });
  }

  // Validate Email format
  if (validateEmail(email)) {
    return res.status(400).send({
      code: '400',
      status: 'Bad Request',
      errors: {
        message: 'Invalid Email',
      },
    });
  }

  // Validate Password
  if (validatePassword(password)) {
    return res.status(400).send({
      code: '400',
      status: 'Bad Request',
      errors: {
        message:
        'The password must be between 8-16 characters and contain numbers',
      },
    });
  }

  // Validate Email Exists
  const verifEmail = await knex('users').where('email', email);
  if (verifEmail.length !== 0) {
    return res.status(409).send({
      code: '409',
      status: 'Conflict',
      errors: {
        message: 'Email already exists',
      },
    });
  }

  const user = {
    name,
    email,
    password,
  };

  // Password hashing
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) throw err;
      user.password = hash;
      // Store user to DB
      knex('users').insert(user).then(res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          message: 'Register Success. Please Log in',
        },
      }));
    });
  });
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Validate email
  const validUser = await knex('users').where('email', email);
  if (validUser.length === 0) {
    return res.status(401).send({
      code: '401',
      status: 'Unauthorized',
      errors: {
        message: 'Incorrect email or password',
      },
    });
  }

  // Check Password
  bcrypt.compare(password, validUser[0].password, function(err, result) {
    if (result) {
      const user = {
        email: validUser[0].email,
        name: validUser[0].name,
      };

      // Make JWT
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: '1hr'});
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,
          {expiresIn: '365d'});

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
          function(err, decoded) {
            const data = {
              user_id: validUser[0].user_id,
              token: refreshToken,
              created_at: new Date(decoded.iat * 1000).toISOString()
                  .slice(0, 19).replace('T', ' '),
              expires_at: new Date(decoded.exp * 1000).toISOString()
                  .slice(0, 19).replace('T', ' '),
            };
            knex('tokens').insert(data).then(res.status(200).send({
              code: '200',
              status: 'OK',
              data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
              },
            }));
          });
    } else {
      return res.status(401).send({
        code: '401',
        status: 'Unauthorized',
        errors: {
          message: 'Incorrect email or password',
        },
      });
    }
  });
};

const dashboard = async (req, res) => {
  res.send({
    message: 'OK',
  });
};

const token = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token avaible
  if (token == null) {
    return res.status(401).send({
      code: '401',
      status: 'Unauthorized',
      errors: {
        message: 'No refresh token provided',
      },
    });
  }

  // Check token in database
  const validToken = await knex('tokens').where('token', token);
  if (validToken.length === 0) {
    return res.status(401).send({
      code: '401',
      status: 'Unauthorized',
      errors: {
        message: 'Invalid token. Please log in again',
      },
    });
  }

  // Verify Token
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function(err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle the expired token error
        return res.status(401).send({
          code: '401',
          status: 'Unauthorized',
          errors: {
            message: 'Token expired. Please log in again',
          },
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({
          code: '401',
          status: 'Unauthorized',
          errors: {
            message: 'Invalid token. Please log in again',
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

    // Retrieve user detail
    const {email, name} = decoded;
    const user = {
      email,
      name,
    };

    // Make JWT
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1hr'});

    res.status(200).send({
      code: '200',
      status: 'OK',
      data: {
        accessToken: accessToken,
      },
    });
  });
};

const attractions = async (req, res) => {
  try {
    const region = await knex('region').select('region.nama_daerah');
    // get attractions by region
    if (region != null) {
      const attractions = await knex('attractions')
          .select('attractions.nama_tempat', 'attractions.rating',
              'regions.nama_daerah as region')
          .leftJoin('regions', 'attractions.id_daerah', 'regions.id_daerah')
          .orderBy('name', 'desc');
      res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          attractions: attractions,
        },
      });
    } else {
      // get all attractions
      const attractions = await knex('attractions')
          .select('attractions.nama_tempat', 'attractions.rating')
          .orderBy('name', 'desc');
      res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          attractions: attractions,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching attractions',
      },
    });
  }
};

const logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).send({
      code: '401',
      status: 'Unauthorized',
      errors: {
        message: 'No refresh token provided',
      },
    });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  token,
  attractions,
  logout,
};

