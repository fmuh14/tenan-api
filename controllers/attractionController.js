const attractions = async (req, res) => {
  try {
    const attractions = await knex('attractions').select('*');
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
        message: 'An error occurred while fetching attractions',
      },
    });
  }
};

module.exports = {
  attractions,
};
