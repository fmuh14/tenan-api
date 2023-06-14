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
        user_id: validUser[0].user_id,
        created_at: validUser[0].created_at,
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

const token = async (req, res) => {
  // Retrieve user detail
  const {email, name} = req;
  const user = {
    email,
    name,
  };

  // Make JWT
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '1hr'});

  return res.status(200).send({
    code: '200',
    status: 'OK',
    data: {
      accessToken: accessToken,
    },
  });
};

const logout = async (req, res) => {
  const refreshToken = req.refreshToken;
  try {
    const result = await knex('tokens')
        .where('token', refreshToken)
        .del();

    if (result == 1) {
      return res.status(200).send({
        code: '200',
        status: 'OK',
        errors: {
          message: 'Sign out success',
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while delete token',
      },
    });
  }
};

const profile = async (req, res) => {
  const {email} = req;

  const result = await knex('users').where('email', email);

  if (result.length == 1) {
    const user = result[0];

    return res.status(500).send({
      code: '200',
      status: 'OK',
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  }
};

const addFavoriteTourism = async (req, res) => {
  const data = {
    user_id: req.user_id,
    id_wisata: req.body.tourism_id,
  };

  const checkIfExist = await knex('tourisms')
      .where('tourisms.id_wisata', data.id_wisata);

  if (checkIfExist.length == 0) {
    return res.status(404).send({
      code: '404',
      status: 'Not Found',
      errors: {
        message: 'the tourism ID you provided does not exist in our records',
      },
    });
  };

  knex('tourism_favorites').insert(data).then(res.status(200).send({
    code: '200',
    status: 'OK',
    data: {
      message: 'Added to favorites',
    },
  }));
};

const deleteFavoriteTourism = async (req, res) => {
  try {
    const result = await knex('tourism_favorites')
        .where('id_wisata', req.params.tourism_id)
        .del();

    if (result == 1) {
      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          message: 'Removed from favorites',
        },
      });
    } else {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'the tourism ID you provided does not exist in our records',
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while delete token',
      },
    });
  }
};

const showFavoriteTourisms = async (req, res) => {
  try {
    const result = await knex('tourism_favorites')
        .select('tourism_favorites.id_wisata')
        .where('user_id', req.user_id);

    if (result.length == 0) {
      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          message: 'No favorite tourisms added',
        },
      });
    } else {
      const idArray = result.map((obj) => obj.id_wisata);

      const tourismsData = await knex('tourisms')
          .select('tourisms.id_wisata as tourism_id',
              'tourisms.nama_tempat as place_name',
              'tourisms.rating',
              'cities.nama_daerah as city',
              'tourisms.category',
              'tourisms.longtitude',
              'tourisms.latitude',
              'tourimages.url_image as image_url')
          .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
          .leftJoin('tourimages', 'tourisms.id_wisata', 'tourimages.id_wisata')
          .whereIn('tourisms.id_wisata', idArray)
          .orderBy('place_name', 'asc');

      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: tourismsData,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while delete token',
      },
    });
  }
};

const addFavoriteLodging = async (req, res) => {
  const data = {
    user_id: req.user_id,
    id_penginapan: req.body.lodging_id,
  };

  const checkIfExist = await knex('lodgings')
      .where('lodgings.id_penginapan', data.id_penginapan);

  if (checkIfExist.length == 0) {
    return res.status(404).send({
      code: '404',
      status: 'Not Found',
      errors: {
        message: 'the lodging ID you provided does not exist in our records',
      },
    });
  };

  knex('lodging_favorites').insert(data).then(res.status(200).send({
    code: '200',
    status: 'OK',
    data: {
      message: 'Added to favorites',
    },
  }));
};

const deleteFavoriteLodging = async (req, res) => {
  try {
    const result = await knex('lodging_favorites')
        .where('id_penginapan', req.params.lodging_id)
        .del();

    if (result == 1) {
      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          message: 'Removed from favorites',
        },
      });
    } else {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'the lodging ID you provided does not exist in our records',
        },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while delete favorited lodging',
      },
    });
  }
};

const showFavoriteLodgings = async (req, res) => {
  try {
    const result = await knex('lodging_favorites')
        .select('lodging_favorites.id_penginapan')
        .where('user_id', req.user_id);

    if (result.length == 0) {
      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          message: 'No favorite lodgings added',
        },
      });
    } else {
      const idArray = result.map((obj) => obj.id_penginapan);

      const lodgingsData = await knex('lodgings')
          .select('lodgings.id_penginapan as lodging_id',
              'lodgings.nama_tempat as place_name',
              'lodgings.rating',
              'cities.nama_daerah as city',
              'lodimages.url_image as image_url')
          .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
          .leftJoin('lodimages', 'lodgings.id_penginapan',
              'lodimages.id_penginapan')
          .whereIn('lodgings.id_penginapan', idArray)
          .orderBy('place_name', 'asc');

      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: lodgingsData,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while delete token',
      },
    });
  }
};

// Export the function
module.exports = {
  login,
  register,
  token,
  logout,
  profile,
  addFavoriteTourism,
  deleteFavoriteTourism,
  showFavoriteTourisms,
  addFavoriteLodging,
  deleteFavoriteLodging,
  showFavoriteLodgings,
};

