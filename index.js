const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoute = require('./routes/login.js');

const app = express();
const port = process.env.PORT;

// Mongo DB conncetion
const database = process.env.MONGOLAB_URI;
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('database connect'))
    .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.use('/', userRoute);

app.listen(port, () => {
  console.log(`MapBan app listening at http://localhost:${port}`);
});
