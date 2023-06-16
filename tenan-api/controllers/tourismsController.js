const axios = require('axios');
const {knex} = require('../configs/data-source.js');


const getAllTourisms = async (req, res) => {
  const query = req.query.q;
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
          .where('tourisms.nama_tempat', 'LIKE', `%${query}%`)
          .count('* as total');
      total = totalQuery[0].total;
      totalPage = Math.ceil(total / size);

      tourisms = await knex('tourisms')
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
          .where('tourisms.nama_tempat', 'LIKE', `%${query}%`)
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
    let favorited = false;
    const userId = req.user_id;
    if (userId) {
      const result = await knex('tourism_favorites').where({
        user_id: userId,
        id_wisata: tourismsId,
      });
      if (result.length == 1) {
        favorited = true;
      }
    }

    const tourism = await knex('tourisms')
        .select('tourisms.id_wisata as tourism_id',
            'tourisms.nama_tempat as place_name',
            'tourisms.rating',
            'tourisms.category',
            'tourisms.description',
            'tourisms.longtitude',
            'tourisms.latitude',
            'tourisms.alamat as address',
            'cities.nama_daerah as city',
            'tourimages.url_image as image_url')
        .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
        .leftJoin('tourimages', 'tourisms.id_wisata', 'tourimages.id_wisata')
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
      tourism.favorited = favorited;
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

const getCity = async (req, res) => {
  try {
    const cities = await knex('cities').select('nama_daerah as city');
    return res.status(200).send({
      code: '200',
      status: 'OK',
      data: cities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching cities',
      },
    });
  }
};

const getRecommendedHotels = async (req, res) => {
  try {
    const {longtitude, latitude} = req.body;
    const predictResponse = await axios.post(process.env.URL_ML_HOTEL, {
      longtitude: longtitude,
      latitude: latitude,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const predictData = predictResponse.data.data;
    const hotels = await knex('cities').select(
        'lodgings.id_penginapan as lodging_id',
        'lodgings.nama_tempat as place_name',
        'lodgings.rating',
        'cities.nama_daerah as city',
        'lodimages.url_image as image_url')
        .from('lodgings')
        .leftJoin('cities', 'lodgings.id_daerah', 'cities.id_daerah')
        .leftJoin('lodimages', 'lodgings.id_penginapan',
            'lodimages.id_penginapan')
        .whereIn('lodgings.nama_tempat', predictData);

    return res.status(200).send({
      code: '200',
      status: 'OK',
      data: hotels,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching predicted hotel',
      },
    });
  }
};

const getRecommendedTourisms = async (req, res) => {
  try {
    const {city} = req.body;
    console.log(city);
    const predictResponse = await axios.post(process.env.URL_ML_TOURISM, {
      city: city,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const predictData = predictResponse.data.data;
    const tourisms = await knex('tourisms').select(
        'tourisms.id_wisata as tourism_id',
        'tourisms.nama_tempat as place_name',
        'tourisms.rating',
        'cities.nama_daerah as city',
        'tourisms.category',
        'tourisms.longtitude',
        'tourisms.latitude',
        'tourimages.url_image as image_url')
        .leftJoin('cities', 'tourisms.id_daerah', 'cities.id_daerah')
        .leftJoin('tourimages', 'tourisms.id_wisata', 'tourimages.id_wisata')
        .whereIn('tourisms.id_wisata', predictData);

    return res.status(200).send({
      code: '200',
      status: 'OK',
      data: tourisms,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: '500',
      status: 'Internal Server Error',
      errors: {
        message: 'An error occurred while fetching predicted tourisms',
      },
    });
  }
};

module.exports = {
  getAllTourisms,
  getTourismsDetail,
  getRecommendedHotels,
  getCity,
  getRecommendedTourisms,
};
