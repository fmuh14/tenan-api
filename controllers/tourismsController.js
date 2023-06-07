const {knex} = require('../configs/data-source.js');

const getAllTourisms = async (req, res) => {
  try {
    const tourisms = await knex('tourisms')
        .select('tourisms.nama_tempat', 'tourisms.rating')
        .orderBy('name', 'desc');
    res.status(200).send({
      code: '200',
      status: 'OK',
      data: {
        tourisms: tourisms,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching all tourisms',
      },
    });
  }
};

const getTourismsbyCity = async (req, res) => {
  try {
    const city = req.body.city;
    if (city != null) {
      const tourisms = await knex('tourisms')
          .select('tourisms.nama_tempat', 'tourisms.rating',
              'cities.nama_daerah as city')
          .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
          .orderBy('name', 'desc');
      res.status(200).send({
        code: '200',
        status: 'OK',
        data: {
          tourisms: tourisms,
        },
      });
    }
    if (!tourisms[0].city) {
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
        message: 'An error occurred while fetching tourism',
      },
    });
  }
};

const getTourismsDetail = async (req, res) => {
  try {
    const {tourismsId} = req.params.tourismsId;
    const tourism = await knex('tourisms')
        .select('tourisms.nama_tempat', 'tourisms.rating',
            'tourisms.alamat', 'tourisms.category',
            'tourisms.description')
        .where('tourisms.id', tourismsId)
        .first();

    res.status(200).send({
      code: '200',
      status: 'OK',
      data: {
        tourisms: tourism,
      },
    });

    if (!tourism) {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'Tourism not found.',
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching tourism',
      },
    });
  }
};


module.exports = {
  getAllTourisms,
  getTourismsbyCity,
  getTourismsDetail,
};
