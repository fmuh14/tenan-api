const express = require('express');
require('dotenv').config();
const userRoute = require('./routes/userRoute.js');
const attractionsRoute = require('./routes/attractionsRoute.js');
const {knex} = require('./configs/data-source.js');

// Test the connection
knex.raw('SELECT 1+1 AS result')
    .then((results) => {
      console.log('Connection to database successful.');
    })
    .catch((error) => {
      console.error('Error connecting to the database:', error);
    });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.use('/users/', userRoute);
app.use('/user/', attractionsRoute);


app.use(function(req, res, next) {
  res.status(404).send({
    code: '404',
    status: 'Not Found',
    errors: {
      message: 'The page or resource you\'re looking for could not be found.',
    },
  });
});

app.listen(port, () => {
  console.log(`Tenan app listening at http://localhost:${port}`);
});
