const {knex} = require('../configs/data-source.js');

const getAllLodgings = async (req, res) => {
  const query = req.query.q;
  const city = req.query.city;
  const page = req.query.page;

  // Set the default value of page to 1 if it is not provided or invalid
  const pageNumber = (page && /^\d+$/.test(page)) ? parseInt(page) : 1;

  let total;
  const size = 10;
  let lodgings;
  let totalPage;

  // Mengecek apakah ada query q , city, dan page.
  if (!query && !city) {
    try {
      // mengecheck total row di table
      const totalQuery = await knex('lodgings').count('* as total');
      total = totalQuery[0].total;
      totalPage = Math.ceil(total / size);

      // kembaliin semuanya tapi pake limit sesuai kesepakatan front-end
      lodgings = await knex('lodgings')
          .select('lodgings.id_penginapan as lodging_id',
              'lodgings.nama_tempat as place_name',
              'lodgings.rating',
              'cities.nama_daerah as city',
              'lodimages.url_image as image_url')
          .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
          .leftJoin('lodimages', 'lodgings.id_penginapan',
              'lodimages.id_penginapan')
          .orderBy('lodgings.nama_tempat', 'desc').limit(size)
          .offset((pageNumber - 1) * size);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        code: '500',
        status: 'Internal Server Error',
        errors: {
          message: 'An error occurred while fetching all lodgings',
        },
      });
    }
  } else if (!query && city) {
    try {
      // mengecheck total row di table
      const totalQuery = await knex('lodgings')
          .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
          .where('cities.nama_daerah', city)
          .count('* as total');
      total = totalQuery[0].total;
      totalPage = Math.ceil(total / size);

      lodgings = await knex('lodgings')
          .select('lodgings.id_penginapan as lodging_id',
              'lodgings.nama_tempat as place_name',
              'lodgings.rating',
              'cities.nama_daerah as city',
              'lodimages.url_image as image_url')
          .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
          .leftJoin('lodimages', 'lodgings.id_penginapan',
              'lodimages.id_penginapan')
          .where('cities.nama_daerah', city)
          .orderBy('nama_tempat', 'desc')
          .limit(size)
          .offset((pageNumber - 1) * size);
      if (lodgings.length == 0 && totalPage == 0) {
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
          message: 'An error occurred while fetching lodging',
        },
      });
    }
  } else if (query && !city) {
    try {
      // mengecheck total row di table
      const totalQuery = await knex('lodgings')
          .where('lodgings.nama_tempat', 'LIKE', `%${query}%`)
          .count('* as total');
      total = totalQuery[0].total;
      totalPage = Math.ceil(total / size);

      lodgings = await knex('lodgings')
          .select('lodgings.id_penginapan as lodging_id',
              'lodgings.nama_tempat as place_name',
              'lodgings.rating',
              'cities.nama_daerah as city',
              'lodimages.url_image as image_url')
          .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
          .leftJoin('lodimages', 'lodgings.id_penginapan',
              'lodimages.id_penginapan')
          .where('lodgings.nama_tempat', 'LIKE', `%${query}%`)
          .orderBy('nama_tempat', 'desc')
          .limit(size)
          .offset((pageNumber - 1) * size);
      if (lodgings.length == 0 && totalPage == 0) {
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
          message: 'An error occurred while fetching lodging',
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
      size: lodgings.length,
      data: lodgings,
    });
  }
};

const getlodgingsDetail = async (req, res) => {
  try {
    const lodgingsId = req.params.lodgingsId;
    let favorited = false;
    const userId = req.user_id;
    if (userId) {
      const result = await knex('lodging_favorites').where({
        user_id: userId,
        id_penginapan: lodgingsId,
      });
      if (result.length == 1) {
        favorited = true;
      }
    }

    const lodging = await knex('lodgings')
        .select('lodgings.id_penginapan as lodging_id',
            'lodgings.nama_tempat as place_name',
            'lodgings.rating',
            'lodgings.alamat as address',
            'lodgings.longtitude',
            'lodgings.latitude',
            'cities.nama_daerah as city',
            'lodimages.url_image as image_url')
        .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
        .leftJoin('lodimages', 'lodgings.id_penginapan',
            'lodimages.id_penginapan')
        .where('lodgings.id_penginapan', lodgingsId)
        .first();

    if (!lodging) {
      return res.status(404).send({
        code: '404',
        status: 'Not Found',
        errors: {
          message: 'Lodging not found',
        },
      });
    } else {
      lodging.favorited = favorited;
      return res.status(200).send({
        code: '200',
        status: 'OK',
        data: lodging,
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
  getlodgingsDetail,
};
