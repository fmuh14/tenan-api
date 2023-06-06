const {knex} = require('../configs/data-source.js');

const getAllAttractions = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching all attractions',
      },
    });
  }
};

const getAttractionsbyCity = async (req, res) => {
  try {
    const city = req.body.city;
    if (city != null) {
      const attractions = await knex('attractions')
          .select('attractions.nama_tempat', 'attractions.rating',
              'cities.nama_daerah as city')
          .leftJoin('cities', 'attractions.id_daerah', 'cities.id_daerah')
          .orderBy('name', 'desc');
      res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          attractions: attractions,
        },
      });
    }
    if (!attractions[0].city) {
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
        message: 'An error occurred while fetching attraction',
      },
    });
  }
};

const getAttractionsDetail = async (req, res) => {
  try {
    const {attractionsId} = req.params.id;
    const attraction = await knex('attractions')
        .select('attractions.nama_tempat', 'attractions.rating',
            'attractions.alamat', 'attractions.category',
            'attractions.description')
        .where('attractions.id', attractionsId)
        .first();

    res.status(200).send({
      code: '200',
      status: 'OK',
      data: {
        attractions: attraction,
      },
    });

    if (!attraction) {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'Attraction not found.',
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching attraction',
      },
    });
  }
};


module.exports = {
  getAllAttractions,
  getAttractionsbyCity,
  getAttractionsDetail,
};
