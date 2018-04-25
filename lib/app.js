const express = require('express');
const app = express();

const auth = require('./routes/auth');
const studios = require('./routes/studios');
const actors = require('./routes/actor');
const films = require('./routes/films');
const reviewers = require('./routes/reviewers');
const reviews = require('./routes/reviews');

app.use(express.json());

app.use('/auth', auth);
app.use('/studios', studios);
app.use('/actors', actors);
app.use('/films', films);
app.use('/reviewers', reviewers);
app.use('/reviews', reviews);

module.exports = app;