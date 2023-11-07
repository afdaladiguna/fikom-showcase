const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate); // set ejs as engine for express app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // parse the req.body
app.use(methodOverride('_method'));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('HOME!');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  if (!err.message) {
    err.message = 'Oh no, Something Went Wrong!';
  }
  res.status(status).render('error', { err });
});

app.listen(3000, () => {
  console.log('Server run on 3000');
});
