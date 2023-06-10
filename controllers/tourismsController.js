const {knex} = require('../configs/data-source.js');

const getAllTourisms = async (req, res) => {
  const query = `%${req.query.q}%`;
  const city = req.query.city;
  const page = req.query.page;

  // Set the default value of page to 1 if it is not provided or invalid
  const pageNumber = (page && /^\d+$/.test(page)) ? parseInt(page) : 1;

  let total;
  const size = 10;
  let tourisms;
  let totalPage;

  // Mengecek apakah ada query q , city, dan page.
  if (!query && !city) {
    try {
      // mengecheck total row di table
      const totalQuery = await knex('tourisms').count('* as total');
      total = totalQuery[0].total;
      totalPage = Math.ceil(total / size);

      // kembaliin semuanya tapi pake limit sesuai kesepakatan front-end
      tourisms = await knex('tourisms')
          .select('tourisms.nama_tempat', 'tourisms.rating',
              'cities.nama_daerah as city')
          .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
          .orderBy('tourisms.nama_tempat', 'desc').limit(size)
          .offset((pageNumber - 1) * size);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        code: '500',
        status: 'Internal Server Error',
        errors: {
          message: 'An error occurred while fetching all tourisms',
        },
      });
    }
  } else if (!query && city) {
    try {
      // mengecheck total row di table
      const totalQuery = await knex('tourisms')
          .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
          .where('cities.nama_daerah', city)
          .count('* as total');
      total = totalQuery[0].total;
      totalPage = Math.ceil(total / size);

      tourisms = await knex('tourisms')
          .select('tourisms.nama_tempat', 'tourisms.rating',
              'cities.nama_daerah as city')
          .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
          .where('cities.nama_daerah', city)
          .orderBy('nama_tempat', 'desc')
          .limit(size)
          .offset((pageNumber - 1) * size);
      if (tourisms.length == 0 && totalPage == 0) {
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
      return res.status(500).send({
        code: '500',
        status: 'Internal Server Error',
        errors: {
          message: 'An error occurred while fetching tourism',
        },
      });
    }
  } else if (query && !city) {
    try {
      // mengecheck total row di table
      const totalQuery = await knex('tourisms')
          .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
          .where('tourisms.nama_tempat', 'LIKE', query)
          .count('* as total');
      total = totalQuery[0].total;
      totalPage = Math.ceil(total / size);

      tourisms = await knex('tourisms')
          .select('tourisms.nama_tempat', 'tourisms.rating',
              'cities.nama_daerah as city')
          .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
          .where('tourisms.nama_tempat', 'LIKE', query)
          .orderBy('nama_tempat', 'desc')
          .limit(size)
          .offset((pageNumber - 1) * size);
      if (tourisms.length == 0 && totalPage == 0) {
        return res.status(404).send({
          code: '404',
          status: 'Not Found',
          errors: {
            message: 'Places not found in the database',
          },
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        code: '500',
        status: 'Internal Server Error',
        errors: {
          message: 'An error occurred while fetching tourism',
        },
      });
    }
  }

  if (pageNumber > totalPage) {
    return res.status(404).send({
      code: '404',
      status: 'Not Found',
      errors: {
        message: 'The requested page does not exist',
      },
    });
  } else {
    return res.status(200).send({
      code: '200',
      status: 'OK',
      current_page: pageNumber,
      total_page: totalPage,
      total: total,
      size: tourisms.length,
      data: tourisms,
    });
  }
};

const getTourismsDetail = async (req, res) => {
  try {
    const tourismsId = req.params.tourismsId;
    const tourism = await knex('tourisms')
        .select('tourisms.nama_tempat', 'tourisms.rating',
            'tourisms.alamat', 'tourisms.category',
            'tourisms.description')
        .where('tourisms.id_wisata', tourismsId)
        .first();

    if (!tourism) {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'Tourism not found',
        },
      });
    } else {
      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: tourism,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
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
