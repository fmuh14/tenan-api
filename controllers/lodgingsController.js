const {knex} = require('../configs/data-source.js');

const getAllLodgings = async (req, res) => {
  try {
    const lodgings = await knex('lodgings')
        .select('lodgings.nama_tempat', 'lodgings.rating')
        .orderBy('name', 'desc');
    res.status(200).send({
      code: '200',
      status: 'OK',
      data: {
        lodgings: lodgings,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching all lodgings',
      },
    });
  }
};

const getLodgingsbyCity = async (req, res) => {
  try {
    const city = req.body.city;
    if (city != null) {
      const lodgings = await knex('lodgings')
          .select('lodgings.nama_tempat', 'lodgings.rating',
              'cities.nama_daerah as city')
          .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
          .orderBy('name', 'desc');
      res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          lodgings: lodgings,
        },
      });
    }
    if (!lodgings[0].city) {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'City not found in the database',
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching lodging',
      },
    });
  }
};

const getlodgingsDetail = async (req, res) => {
  try {
    const {lodgingsId} = req.params.lodgingsId;
    const lodging = await knex('lodgings')
        .select('lodgings.nama_tempat', 'lodgings.rating',
            'lodgings.alamat', 'lodgings.category',
            'lodgings.description')
        .where('lodgings.id', lodgingsId)
        .first();

    res.status(200).send({
      code: '200',
      status: 'OK',
      data: {
        lodgings: lodging,
      },
    });

    if (!lodging) {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'Lodging not found.',
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching lodging',
      },
    });
  }
};

module.exports = {
  getAllLodgings,
  getLodgingsbyCity,
  getLodgingsDetail,
};
