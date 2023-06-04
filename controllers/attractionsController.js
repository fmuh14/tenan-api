const {knex} = require('../configs/data-source.js');

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

module.exports = {
  attractions,
};
